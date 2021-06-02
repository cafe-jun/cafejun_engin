import './style.css';

const ws = new WebSocket('ws://localhost:8081/websocket');
const myVideo = document.body.querySelector('#myVideo');

const rtcConfiguration = {};

ws.addEventListener('message', (event) => {
    handleMessage(event.data.toString());
});

function sendJSON(object) {
    const message = JSON.stringify(object);
    ws.send(message);
}

let sessionId = null;
let localPeer = {};

function handleMessage(message) {
    try {
        const action = JSON.parse(message);
        if (!action.type) {
            throw new Error('There is no type in action');
        }

        switch (action.type) {
            case 'connected':
                console.log(`sessionId: ${action.id}`);
                sessionId = action.id;
                break;
            case 'entered':
                if (action.sessionId === sessionId) {
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
        console.log(e);
    }
}

const channelForm = document.querySelector('#channelForm');

async function createMediaStream() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        console.log('Received Stream');
        return stream;
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
    const stream = await createMediaStream();

    const localPeer = new RTCPeerConnection(rtcConfiguration);
    localPeer[to] = localPeer;

    localPeer.addEventListener('icecandidate', (e) => {
        icecandidate(to, e.candidate);
    });

    const video = document.createElement('video');
    document.body.appendChild(video);
    video.autoplay = true;

    localPeer.addEventListener('track', (ev) => {
        if (video.srcObject !== ev.streams[0]) {
            video.srcObject = ev.streams[0];
        }
    });

    stream.getTracks().forEach((track) => {
        localPeer.addTrack(track, stream);
    });

    const offer = await localPeer.createOffer();
    console.log('offer: ', offer);
    await localPeer.setLocalDescription(offer);

    sendJSON({
        type: 'call',
        to,
        description: offer,
    });
}

async function answer(to, description) {
    const stream = await createMediaStream();

    localPeer = new RTCPeerConnection(rtcConfiguration);
    localPeer.addEventListener('icecandidate', (e) => {
        icecandidate(to, e.candidate);
    });
    const video = document.createElement('video');
    document.body.appendChild(video);
    video.autoplay = true;

    localPeer.addEventListener('track', (ev) => {
        if (video.srcObject !== ev.streams[0]) {
            video.srcObject = ev.streams[0];
        }
    });

    stream.getTracks().forEach((track) => {
        localPeer.addTrack(track, stream);
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

async function answered(from, description) {
    await localPeer.setRemoteDescription(description);
    console.log(`setRemoteDescription success for ${from}`);
}

function icecandidate(to, candidate) {
    sendJSON({
        type: 'candidate',
        to,
        candidate,
    });
}

function candidated(from, candidate) {
    try {
        localPeer.addIceCandidate(candidate);
        console.log(`Candidate from ${from} success!`);
    } catch (e) {
        console.error(`Failed to candidate: ${e.toString()}`);
    }
}

channelForm.addEventListener('submit', async (e) => {
    channelForm.querySelector('button').disabled = true;
    e.preventDefault();

    //await createMediaStream();
    enterChannel(channelForm.channelName.value);
});

createMediaStream().then((stream) => {
    const myVideo = document.createElement('video');
    document.body.appendChild(myVideo);
    myVideo.srcObject = stream;
    myVideo.autoplay = true;
    myVideo.volume = 0;
});
