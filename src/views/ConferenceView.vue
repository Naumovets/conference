<template>


    <div class="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center">
        <div class="container">
            <div class="row w-100 bg-light rounded p-4 justify-content-center">
                <div class="col-12 col-md-6 d-flex flex-column align-items-center">
                    <div class="player" @mouseenter="showControls = true" @mouseleave="showControls = false">
                        <video id="localVideo" class="w-100" autoplay ref="localVideo"></video>
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
                    <h1 class="fs-3">Ожидание подключения</h1>
                    <form @submit.prevent="joinConference">
                        <div class="row">
                            <div class="mb-3 col-8">
                                <input type="password" class="form-control" id="InputPassword"
                                    v-model="conferencePassword" placeholder="Секретный код">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-success">Присоединиться</button>
                    </form>
                </div>
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
                        <video id="localVideo" class="w-100" autoplay ref="localVideo"></video>
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
                        <div class="row">
                            <div class="mb-3 col-8">
                                <input type="password" class="form-control" id="InputPassword"
                                    v-model="conferencePassword" placeholder="Секретный код">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-success">Присоединиться</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
export default {
    name: 'ConferenceView',
    setup() {
        const localVideo = ref(null);
        const conferencePassword = ref('');
        const showJoinModal = ref(true);
        const showControls = ref(false);
        const cameraEnabled = ref(false);
        const microphoneEnabled = ref(false);
        const stream = ref(null); // Используем один поток

        onMounted(() => {


            // Получаем доступ к камере и микрофону одновременно
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(s => {
                    stream.value = s;
                    stream.value.getVideoTracks()[0].enabled = false;
                    stream.value.getAudioTracks()[0].enabled = false;
                    localVideo.value.srcObject = s;
                })
                .catch(error => {
                    console.error('Ошибка доступа к камере и микрофону:', error);
                });
        });

        const toggleCamera = () => {
            cameraEnabled.value = !cameraEnabled.value;
            if (cameraEnabled.value) {
                stream.value.getVideoTracks()[0].enabled = true;
            } else {
                stream.value.getVideoTracks()[0].enabled = false;
            }
        };

        const toggleMicrophone = () => {
            microphoneEnabled.value = !microphoneEnabled.value;
            if (microphoneEnabled.value) {
                stream.value.getAudioTracks()[0].enabled = true;
            } else {
                stream.value.getAudioTracks()[0].enabled = false;
            }
        };

        const joinConference = () => {
            // ... (Логика подключения)
            showJoinModal.value = false;
        };

        return {
            localVideo,
            conferencePassword,
            joinConference,
            showJoinModal,
            showControls,
            cameraEnabled,
            microphoneEnabled,
            toggleCamera,
            toggleMicrophone
        };
    },
};
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