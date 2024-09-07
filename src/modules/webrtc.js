let ws = new WebSocket("{{.}}");

function join() {
    alert(document.getElementById("token").value)
    ws.send(JSON.stringify({
        event: 'join', data: JSON.stringify({
            sid: document.getElementById("sid").value,
            token: document.getElementById("token").value
        })
    }))
}

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        let pc = new RTCPeerConnection()

        document.getElementById("join").onclick = join;

        pc.ontrack = function (event) {
            if (event.track.kind === 'audio') {
                return
            }

            let el = document.createElement(event.track.kind)
            el.srcObject = event.streams[0]
            el.autoplay = true
            el.controls = true
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

        document.getElementById('localVideo').srcObject = stream
        stream.getTracks().forEach(track => pc.addTrack(track, stream))
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
                case 'offer':
                    let offer = JSON.parse(msg.data)
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
    }).catch(window.alert)