import './style.css';

const ws = new WebSocket('ws://127.0.0.1:8081/websocket');
ws.addEventListener('message', (event) => {
    handleMessage(event.data.toString());
});

let localStream = null;

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

function call(sessionId) {
    if (!localStream) return;
    const videoTracks = localStream.getVideoTrack();
    const audioTrack = localStream.getAudioTrack();
    sendJSON({
        type: 'call',
        to: sessionId,
    });
}

function answer(to) {
    sendJSON({
        type: 'answer',
        to: to,
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
                if (action.sessionId === sessionId) {
                    console.log('entered Success');
                    break;
                }
                //console.dir(action);
                console.log(`Call ${action.sessionId}`);
                call(action.sessionId);
                break;
            case 'called':
                console.log(`${action.from}`);
                answer(action.from);
                break;
        }
    } catch (e) {
        //console.error(e);
        console.error(`Fail to parse message : ${message}`);
    }
}

const channelForm = document.querySelector('#channelForm');

channelForm.addEventListener('submit', (e) => {
    //console.log(e.target.channelName.value);
    enterChannel(channelForm.channelName.value);
    channelForm.querySelector('button').disabled = true;

    // sendJSON(
    //     JSON.stringify({
    //         type: 'enter',
    //         channel: e.target.channelName.value,
    //     }),
    // );
    //initializeStream();
    e.preventDefault();
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
