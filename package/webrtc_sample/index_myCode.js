import './style.css';

const ws = new WebSocket('ws://127.0.0.1:8081/websocket');
const myVideo = document.body.querySelector('#myVideo');

ws.addEventListener('message', (event) => {
    handleMessage(event.data.toString());
});

const rtcConfigureation = {};

function sendJSON(object) {
    const message = JSON.stringify(object);
    ws.send(message);
}
let localStream = null;
let localPeer = null;

async function initializeStream() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        console.log('Receive Local Stream');
    } catch (e) {
        console.error(e);
    }
}

function enterChannel(channelName) {
    sendJSON({
        type: 'enter',
        channel: channelName,
    });
}

async function call(to) {
    if (!localStream) return;

    localPeer = new RTCPeerConnection(rtcConfigureation);
    localPeer.addEventListener('icecandidate', (e) => {
        icecandidate(to, e.candidate);
    });
    localPeer.addEventListener('track', (ev) => {
        if (myVideo.srcObject !== ev.streams[0]) {
            myVideo.srcObject = ev.streams[0];
        }
    });
    localStream.getTracks().forEach((track) => {
        localPeer.addTrack(track, localStream);
    });

    const offer = await localPeer.createOffer();
    console.log(`offer: ${offer}`);
    await localPeer.setLocalDescription(offer);

    sendJSON({
        type: 'call',
        to,
        description: offer,
    });
}

async function answer(to, description) {
    //console.log(`LocalStream : ${localStream}`);

    if (!localStream) return;

    localPeer = new RTCPeerConnection(rtcConfigureation);
    localPeer.addEventListener('icecandidate', (e) => {
        console.log('object');
        icecandidate(to, e.candidate);
        //console.log('icecandidate');
    });
    localPeer.addEventListener('track', (ev) => {
        if (myVideo.srcObject !== ev.streams[0]) {
            myVideo.srcObject = ev.streams[0];
        }
    });

    localStream.getTracks().forEach((track) => {
        localPeer.addTrack(track, localStream);
    });
    await localPeer.setRemoteDescription(description);
    const answer = await localPeer.createAnswer();
    await localPeer.setLocalDescription(answer);

    sendJSON({
        type: 'answer',
        to,
        description: answer,
    });
}

async function candidated(from, candidate) {
    try {
        localPeer.addIceCandidate(candidate);
        console.log(`Candidated ${from} Success`);
    } catch (e) {
        console.error(`Fail to candidate ${e.toString()}`);
    }
}

async function answered(from, description) {
    await localPeer.setRemoteDescription(description);
    console.log(`setRemoteDescription Success for ${from}`);
}

async function icecandidate(to, candidate) {
    sendJSON({
        type: 'candidate',
        to,
        candidate,
    });
}

let sessionId = null;

function handleMessage(message) {
    try {
        const action = JSON.parse(message);
        if (!action.type) {
            throw new Error('There is no Type');
        }
        switch (action.type) {
            case 'connected':
                console.log(`sessionId : ${action.id}`);
                sessionId = action.id;
                break;
            case 'entered':
                if (action.sessionId === sessionId) {
                    console.log('entered Success');
                    break;
                }
                call(action.sessionId);
                break;
            case 'called':
                answer(action.from, action.description);
                break;
            case 'answered':
                answered(action.from, action.description);
                break;
            case 'candidated':
                candidated(action.from, action.candidate);
                break;
        }
    } catch (e) {
        //console.error(e);
        console.error(`Fail to parse message : ${message}`);
    }
}

const channelForm = document.querySelector('#channelForm');

channelForm.addEventListener('submit', async (e) => {
    //console.log(e.target.channelName.value);
    channelForm.querySelector('button').disabled = true;

    e.preventDefault();
    await initializeStream();
    enterChannel(channelForm.channelName.value);
    // sendJSON(
    //     JSON.stringify({
    //         type: 'enter',
    //         channel: e.target.channelName.value,
    //     }),
    // );
});
//const button = document.body.querySelector('#binLoadCam');
// const myVideo = document.body.querySelector('#myVideo');

// async function loadCamera() {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//             audio: true,
//             video: true,
//         });
//         const videoTrack = stream.getVideoTracks();
//         myVideo.srcObject = stream;
//     } catch (e) {
//         console.error(e);
//     }
// }

// button.addEventListener('click', () => {
//     loadCamera();
// });
