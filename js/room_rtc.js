
// **YOUR AGORA APP ID

// piyushpatel
const APP_ID = "296903975a8848c49a111f8bf2602098"
// alone
// const APP_ID = "ca78fb2ba5c64a1f9bf42516a166cc86"


// session storage stay untill brower closed

let uid = sessionStorage.getItem('uid')
if (!uid) {
    uid = String(Math.floor(Math.random() * 10000))
    sessionStorage.setItem('uid', uid)
}

let token = null;
let client;

let rtmClient;
let channel;

// querystr is point out the search box and  find the link
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// getting room id
let roomId = urlParams.get('room')

if (!roomId) {
    roomId = 'main';
}

let displayName = sessionStorage.getItem('display_name')

// redirect to lobby if no display name
if (!displayName) {
    window.location = 'index.html'
}

// actual audio and video streams
let localTracks = []
let remoteUsers = {} //new users streams{userid :{audio,video}}

// screen sharing audio video
let localScreenTracks;
let sharingScreen = false;

// estblish connection with server and that room/conference video
let joinRoomInit = async () => {

    rtmClient = await AgoraRTM.createInstance(APP_ID)
    await rtmClient.login({ uid, token })

    await rtmClient.addOrUpdateLocalUserAttributes({ 'name': displayName })

    channel = await rtmClient.createChannel(roomId)
    await channel.join()

    channel.on('MemberJoined', handleMemberJoined)
    channel.on('MemberLeft', handleMemberLeft)
    channel.on('ChannelMessage', handleChannelMessage)

    getMembers()
    addBotMessageToDom(`Welcome to the room ${displayName}! 👋`)

    client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    await client.join(APP_ID, roomId, token, uid)

    // ____________________________ video
    client.on('user-published', handleUserPublished)
    client.on('user-left', handleUserLeft)
    joinStream()
}

// join room on click 
let joinStream = async () => {

    document.getElementById('join-btn').style.display = 'none'
    document.querySelector('.intr').style.display = 'flex'

    // ask/request user for audio and camera permissions 
    // and store camera and audio in localtracks 
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks({}, {
        encoderConfig: {
            width: { min: 640, ideal: 640, max: 1920 },
            height: { min: 360, ideal: 480, max: 1080 }
        }
    })

    // ##################################################################
    // let { name } = await rtmClient.getUserAttributesByKeys(MemberId, ['name']);


    let player = `<div class="video__container" id="user-container-${uid}">
    <div class="video-player" id="user-${uid}"></div>
    </div>`

    // adding user videos into DOM
    document.getElementById('streams__container').insertAdjacentHTML('beforeend', player)
    document.getElementById(`user-container-${uid}`).addEventListener('click', expandVideoFrame)

    localTracks[1].play(`user-${uid}`)
    await client.publish([localTracks[0], localTracks[1]])
}


let switchToCamera = async () => {
    let player = `<div class="video__container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}">${displayName}</div>
                 </div>`
    displayFrame.insertAdjacentHTML('beforeend', player)

    // await localTracks[0].setMuted(true) // 0 contains audio
    await localTracks[1].setMuted(true) // 1 contains video

    localTracks[1].play(`user-${uid}`)
    await client.publish([localTracks[1]])
}


let handleUserPublished = async (user, mediaType) => {
    remoteUsers[user.uid] = user

    
    await client.subscribe(user, mediaType)

    let player = document.getElementById(`user-container-${user.uid}`)
    if (player === null) {
        player = `<div class="video__container" id="user-container-${user.uid}">
            <div class="video-player" id="user-${user.uid}"></div>
            </div>`

        document.getElementById('streams__container').insertAdjacentHTML('beforeend', player)
        document.getElementById(`user-container-${user.uid}`).addEventListener('click', expandVideoFrame)
    }

   

    if (mediaType === 'video') {
        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio') {
        user.audioTrack.play()
    }

}
// removing that container
let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    let item = document.getElementById(`user-container-${user.uid}`)
    if (item) {
        item.remove()
    }

    if (userIdInDisplayFrame === `user-container-${user.uid}`) {
        displayFrame.style.display = null

    }
}

let toggleMic = async (e) => {
    // icons div
    let button = e.currentTarget

    // if muted then
    if (localTracks[0].muted) {
        await localTracks[0].setMuted(false)
        button.innerHTML = `<i class="fa-solid fa-microphone"></i>
        <h6> mute</h6>`;

    } else {
        await localTracks[0].setMuted(true)
        button.innerHTML = `<i class="fa-solid fa-microphone-slash"></i>
        <h6> unmute</h6>`;
    }
}

let toggleCamera = async (e) => {
    let button = e.currentTarget

    if (localTracks[1].muted) {
        await localTracks[1].setMuted(false)
        button.innerHTML = `<i class="fa-solid fa-video"></i>
        <h6> camera</h6`;

    } else {
        await localTracks[1].setMuted(true)
        button.innerHTML = `<i class="fa-solid fa-video-slash"></i>
        <h6> camera</h6>`;
    }
}

let toggleScreen = async (e) => {
    let screenButton = e.currentTarget
    let cameraButton = document.getElementById('camera')

    if (!sharingScreen) {
        sharingScreen = true

        cameraButton.style.display = 'none'
        cameraButton.innerHTML = `<i class="fa-solid fa-video-slash"></i>
        <h6> camera</h6>`;


        // create screen sharing 
        localScreenTracks = await AgoraRTC.createScreenVideoTrack()

        document.getElementById(`user-container-${uid}`).remove()
        displayFrame.style.display = 'block'

        let player = `<div class="video__container" id="user-container-${uid}">
                <div class="video-player" id="user-${uid}">${displayName}</div>
            </div>`;

        displayFrame.insertAdjacentHTML('beforeend', player)
        document.getElementById(`user-container-${uid}`).addEventListener('click', expandVideoFrame)

        userIdInDisplayFrame = `user-container-${uid}`
        localScreenTracks.play(`user-${uid}`)

        await client.unpublish([localTracks[1]])
        await client.publish([localScreenTracks])


    } else {
        sharingScreen = false
        cameraButton.style.display = 'block'
        document.getElementById(`user-container-${uid}`).remove()
        await client.unpublish([localScreenTracks])

        switchToCamera()
    }
}

let leaveStream = async (e) => {
    e.preventDefault()

    document.querySelector('.intr').style.display = 'none';
    document.getElementById('join-btn').style.display = 'block';

    for (let i = 0; localTracks.length > i; i++) {
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.unpublish([localTracks[0], localTracks[1]])

    if (localScreenTracks) {
        await client.unpublish([localScreenTracks])
    }

    document.getElementById(`user-container-${uid}`).remove()

    channel.sendMessage({ text: JSON.stringify({ 'type': 'user_left', 'uid': uid }) })
}



document.getElementById('camera').addEventListener('click', toggleCamera)
document.getElementById('mic').addEventListener('click', toggleMic)
document.getElementById('screen').addEventListener('click', toggleScreen)
document.getElementById('leave').addEventListener('click', leaveStream)

// document.getElementById('join-btn').addEventListener('click', joinStream)

joinRoomInit();
