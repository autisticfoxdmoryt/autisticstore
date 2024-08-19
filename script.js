document.addEventListener('DOMContentLoaded', () => {
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    const chatMessage = document.getElementById('chatMessage');
    const chatBox = document.getElementById('chatBox');
    const startStreamButton = document.getElementById('startStream');
    const stopStreamButton = document.getElementById('stopStream');
    const sendMessageButton = document.getElementById('sendMessage');
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    const toggleDarkModeButton = document.getElementById('toggleDarkMode');
    
    let localStream;
    let peerConnection;
    const ws = new WebSocket('wss://your-render-url');

    const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.sdp) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
            if (data.sdp.type === 'offer') {
                peerConnection.createAnswer()
                    .then((answer) => peerConnection.setLocalDescription(answer))
                    .then(() => ws.send(JSON.stringify({ sdp: peerConnection.localDescription })));
            }
        } else if (data.ice) {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.ice));
        } else if (data.message) {
            chatBox.innerHTML += `<div>Someone: ${data.message}</div>`;
        }
    };

    ws.onopen = () => {
        startStreamButton.disabled = false;
        stopStreamButton.disabled = true;
    };

    startStreamButton.addEventListener('click', async () => {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        peerConnection = new RTCPeerConnection(configuration);

        peerConnection.ontrack = (event) => {
            remoteVideo.srcObject = event.streams[0];
        };

        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                ws.send(JSON.stringify({ ice: event.candidate }));
            }
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        ws.send(JSON.stringify({ sdp: peerConnection.localDescription }));

        startStreamButton.disabled = true;
        stopStreamButton.disabled = false;
    });

    stopStreamButton.addEventListener('click', () => {
        localStream.getTracks().forEach(track => track.stop());
        peerConnection.close();
        localVideo.srcObject = null;
        remoteVideo.srcObject = null;
        startStreamButton.disabled = false;
        stopStreamButton.disabled = true;
    });

    sendMessageButton.addEventListener('click', () => {
        const message = chatMessage.value;
        chatMessage.value = '';
        chatBox.innerHTML += `<div>You: ${message}</div>`;
        ws.send(JSON.stringify({ message }));
    });

    toggleDarkModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});
