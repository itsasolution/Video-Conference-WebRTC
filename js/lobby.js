let form = document.getElementById('lobby__form')

// auto check previously used name from your broweser sesstorg
let displayName = sessionStorage.getItem('display_name')
if (displayName) {
    form.name.value = displayName
}

// local vs session local auto fill name but session will not 

let inviteCode;
let createRoom = document.getElementById("create__room__btn");

createRoom.addEventListener("click", () => {
    document.getElementById("room-name").style.display = "block";
})

form.addEventListener('submit', (e) => {
    e.preventDefault()

    // storing used name in storage "name is name="room/name"
    sessionStorage.setItem('display_name', e.target.name.value)

    // name = "room"
    inviteCode = 1;

    if (e.target.room.value) {
        inviteCode = e.target.room.value;
        
        if(!inviteCode)
        inviteCode = String(Math.floor(Math.random() * 10000))
    }

    // after submit it will redirect the page to "room.html"
    window.location = `conferenc.html?room=${inviteCode}`
})