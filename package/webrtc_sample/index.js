import './style.css';

const ws = new WebSocket('ws://127.0.0.1:8081/websocket');
ws.addEventListener('message', (event) => {
    handleMessage(event.data.toString());
});

const rtcConfigureation = {};

let localStream = null;
let localPeer = null;

function sendJSON(object) {
    const message = JSON.stringify(object);
    ws.send(message);
}

async function initializeStream() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
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
        console.log('icecandidate');
        icecandidate(to, e.candidate);
    });

    localStream.getTracks().forEach((track) => {
        localPeer.addTrack(track);
    });

    const offer = await localPeer.createOffer();
    console.log(`offer: ${offer}`);
    await localPeer.setLocalDescription(offer);

    //const remotePeer =
    sendJSON({
        type: 'call',
        to,
        description: offer,
    });
    console.dir(`LocalStream : ${localStream}`);
}

async function answer(to, description) {
    console.log(`LocalStream : ${localStream}`);

    if (!localStream) return;

    localPeer = new RTCPeerConnection(rtcConfigureation);
    localPeer.addEventListener('icecandidate', (e) => {
        icecandidate(to, e.candidate);
        console.log('icecandidate');
    });
    localStream.getTracks().forEach((track) => {
        localPeer.addTrack(track, localStream);
    });
    console.log('여기 실행?');
    await localPeer.setRemoteDescription(description);
    const answer = await localPeer.createAnswer();
    localPeer.setLocalDescription(answer);

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
    console.log(`Answered Call from Success for ${from}`);
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
        //console.log(`message : ${typeof message}`);
        const action = JSON.parse(message);
        //console.dir(`action : ${typeof action}`);
        //console.log(`action type : ${action.type}`);
        if (!action.type) {
            throw new Error('There is no Type');
        }
        console.log(action);
        switch (action.type) {
            case 'connected':
                console.log(`sessionId : ${action.id}`);
                sessionId = action.id;
                break;
            case 'entered':
                console.dir(`${action.sessionId}`);
                if (action.sessionId === sessionId) {
                    console.log('entered Success');
                    break;
                }
                console.log(`Call ${action.sessionId}`);
                call(action.sessionId);
                break;
            case 'called':
                console.log(`called ${action.from}`);
                answer(action.from, action.description);
                break;
            case 'answered':
                console.log(`Answered : ${action.from}`);
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

    // sendJSON(
    //     JSON.stringify({
    //         type: 'enter',
    //         channel: e.target.channelName.value,
    //     }),
    // );
    e.preventDefault();
    await initializeStream();
    enterChannel(channelForm.channelName.value);
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
