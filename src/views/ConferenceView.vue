<template>

    <div class="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div class="w-100 bg-dark rounded p-4 justify-content-center" style="min-height: 90vh">
            <div id="remoteVideos" class="row row-cols-2 row-cols-md-3  d-flex justify-content-center"
                style="min-height: 70vh;">
                <div class="player col h-100">
                    <video id="localVideo" class="w-100" autoplay ref="localVideo"></video>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-5">
                <button id="cam" class="btn" :class="{ 'btn-secondary': cameraEnabled, 'btn-danger': !cameraEnabled }"
                    @click="toggleCamera">
                    Камера
                </button> <button id="mic" class="btn mx-3"
                    :class="{ 'btn-secondary': microphoneEnabled, 'btn-danger': !microphoneEnabled }"
                    @click="toggleMicrophone">
                    Микрофон
                </button>
                <RouterLink to="/" class="btn btn-danger">выйти</RouterLink>
            </div>

        </div>
    </div>

    <!-- Окно входа в конференцию -->
    <div class="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center"
        id="join-conference-modal" v-if="showJoinModal">
        <div class="container">
            <div class="row w-100 bg-light rounded p-4 justify-content-center">
                <div class="col-12 col-md-6 d-flex flex-column align-items-center">
                    <div class="player" @mouseenter="showControls = true" @mouseleave="showControls = false">
                        <video id="previewVideo" class="w-100" autoplay ref="previewVideo"></video>
                        <div class="controls" v-if="showControls">
                            <button id="cam" class="btn"
                                :class="{ 'btn-secondary': cameraEnabled, 'btn-danger': !cameraEnabled }"
                                @click="toggleCamera">
                                Камера
                            </button>
                            <button id="mic" class="btn"
                                :class="{ 'btn-secondary': microphoneEnabled, 'btn-danger': !microphoneEnabled }"
                                @click="toggleMicrophone">
                                Микрофон
                            </button>
                        </div>
                    </div>
                    <p class="text-muted">Проверьте качество звука, после подключения вы не будете себя слышать.</p>
                </div>
                <div class="col-12 col-md-6 col-lg-4 d-flex flex-column justify-content-center">
                    <h1 class="fs-4 mb-5">WebConf2024: Развитие протокола http, куда движется интернет</h1>
                    <form @submit.prevent="joinConference">
                        <button type="submit" class="btn btn-success">Присоединиться</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';
import * as sdpTransform from 'sdp-transform';

const props = defineProps({
    uuid: {
        type: String,
        required: true
    }
});

const previewVideo = ref(null);
const localVideo = ref(null);
const conferencePassword = ref('');
const showJoinModal = ref(true);
const showControls = ref(false);
const cameraEnabled = ref(false);
const microphoneEnabled = ref(false);
const stream = ref(null);
const localStream = ref(null);
const previewStream = ref(null);
const ws = new WebSocket("ws://localhost:9000/websocket");

onMounted(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(s => {
            stream.value = s;
            stream.value.getVideoTracks()[0].enabled = false;
            stream.value.getAudioTracks()[0].enabled = false;
            // Создаем клоны потока для видео
            localStream.value = s.clone(); // Клон только для видео
            previewStream.value = s.clone(); // Клон для видео и аудио

            // Отключаем аудио в локальном потоке
            localStream.value.getAudioTracks().forEach(track => track.enabled = false);

            // Устанавливаем потоки для видео
            localVideo.value.srcObject = localStream.value;
            previewVideo.value.srcObject = previewStream.value;
        })
        .catch(error => {
            console.error('Ошибка доступа к камере и микрофону:', error);
        });
});

const toggleCamera = () => {
    cameraEnabled.value = !cameraEnabled.value;
    if (cameraEnabled.value) {
        stream.value.getVideoTracks()[0].enabled = true;
        localStream.value.getVideoTracks()[0].enabled = true;
        previewStream.value.getVideoTracks()[0].enabled = true;
    } else {
        stream.value.getVideoTracks()[0].enabled = false;
        localStream.value.getVideoTracks()[0].enabled = false;
        previewStream.value.getVideoTracks()[0].enabled = false;
    }
};

const toggleMicrophone = () => {
    microphoneEnabled.value = !microphoneEnabled.value;
    if (microphoneEnabled.value) {
        stream.value.getAudioTracks()[0].enabled = true;
        previewStream.value.getAudioTracks()[0].enabled = true;
    } else {
        stream.value.getAudioTracks()[0].enabled = false;
        previewStream.value.getAudioTracks()[0].enabled = false;
    }
};

const joinConference = () => {
    showJoinModal.value = false;
    let pc = new RTCPeerConnection()

    ws.send(JSON.stringify({
        event: 'join', 
        data: JSON.stringify({
            sid: props.uuid,
            token: localStorage.getItem('access_token')
        })
    }))

    pc.ontrack = function (event) {
        if (event.track.kind === 'audio') {
            return
        }
        else {
            console.log('Track!!: ', event)
        }

        let el = document.createElement(event.track.kind)
        el.classList = "col h-100"
        el.srcObject = event.streams[0]
        el.autoplay = true
        // el.controls = true
        document.getElementById('remoteVideos').appendChild(el)

        event.track.onmute = function (event) {
            el.play()
        }

        event.streams[0].onremovetrack = ({ track }) => {
            if (el.parentNode) {
                el.parentNode.removeChild(el)
            }
        }
    }

    stream.value.getTracks().forEach(track => {
        console.log(track, stream)
        pc.addTrack(track, stream.value);
    })
    pc.onicecandidate = e => {
        if (!e.candidate) {
            return
        }

        ws.send(JSON.stringify({ event: 'candidate', data: JSON.stringify(e.candidate) }))
    }

    ws.onclose = function (evt) {
        window.alert("Websocket has closed")
    }

    ws.onmessage = function (evt) {
        let msg = JSON.parse(evt.data)
        if (!msg) {
            return console.log('failed to parse msg')
        }

        switch (msg.event) {
            case 'error':
                console.log(msg.data)
                return
            case 'user':
                let user = JSON.parse(msg.data)
                // user_by_track.set(user.track_id, user.username);
                return

            case 'offer':
                let offer = JSON.parse(msg.data)
                // console.log(sdpTransform.parse(offer.sdp));

                if (!offer) {
                    return console.log('failed to parse answer')
                }

                
                pc.setRemoteDescription(offer)
                pc.createAnswer().then(answer => {
                    pc.setLocalDescription(answer)
                    ws.send(JSON.stringify({ event: 'answer', data: JSON.stringify(answer) }))
                })
                return

            case 'candidate':
                let candidate = JSON.parse(msg.data)
                if (!candidate) {
                    return console.log('failed to parse candidate')
                }

                pc.addIceCandidate(candidate)
        }
    }

    ws.onerror = function (evt) {
        console.log("ERROR: " + evt.data)
    }
};

function join() {
    ws.send(JSON.stringify({
        event: 'join', data: JSON.stringify({
            sid: document.getElementById("sid").value,
            token: document.getElementById("token").value
        })
    }))
}

defineExpose({
    previewVideo,
    localVideo,
    conferencePassword,
    joinConference,
    showJoinModal,
    showControls,
    cameraEnabled,
    microphoneEnabled,
    toggleCamera,
    toggleMicrophone
});
</script>

<style scoped>
#join-conference-modal {
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

#join-conference-modal video {
    border-radius: 10px;
}

.player {
    position: relative;
    /* Важно для позиционирования плашки */
}

.controls {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    /* Центрирование по горизонтали */
    display: flex;
    gap: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 5px;
}

.controls button {
    color: white;
    border: none;
}
</style>