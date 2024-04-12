let handleMemberJoined = async (MemberId) => {
    console.log('A new member has joined the room:', MemberId)
    addMemberToDom(MemberId)

    let members = await channel.getMembers()
    updateMemberTotal(members)

    let { name } = await rtmClient.getUserAttributesByKeys(MemberId, ['name'])
    addBotMessageToDom(`Welcome to the room ${name}! 👋`)

}

let addMemberToDom = async (MemberId) => {
    // destructuring
    let { name } = await rtmClient.getUserAttributesByKeys(MemberId, ['name'])

    let membersWrapper = document.getElementById('member__list')
    let memberItem = `<div class="member__wrapper" id="member__${MemberId}__wrapper">
                        <span class="green__icon"></span>
                        <span class="member_name">${name}</span>
                    </div>`

    membersWrapper.insertAdjacentHTML('beforeend', memberItem)
}

let updateMemberTotal = async (members) => {
    let total = document.getElementById('members__count')
    total.innerText = members.length
}

let handleMemberLeft = async (MemberId) => {
    removeMemberFromDom(MemberId)

    let members = await channel.getMembers()
    updateMemberTotal(members)
}

let removeMemberFromDom = async (MemberId) => {
    let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`)
    let name = memberWrapper.getElementsByClassName('member_name')[0].textContent
    addBotMessageToDom(`${name} has left the room.`)

    memberWrapper.remove()
}

let getMembers = async () => {
    let members = await channel.getMembers()
    updateMemberTotal(members)
    for (let i = 0; members.length > i; i++) {
        addMemberToDom(members[i])
    }
}

let handleChannelMessage = async (messageData, MemberId) => {
    console.log('A new message was received')
    let data = JSON.parse(messageData.text)

    if (data.type === 'chat') {
        addMessageToDom(data.displayName, data.message)
    }

    if (data.type === 'user_left') {
        document.getElementById(`user-container-${data.uid}`).remove()
    }

}

let sendMessage = async (e) => {
    e.preventDefault()

    let message = e.target.message.value;
    if (message !== "") {
        channel.sendMessage({ text: JSON.stringify({ 'type': 'chat', 'message': message, 'displayName': displayName }) })
        addMessageToDom(displayName, message);
        e.target.reset();
    }
}

let messagesWrapper = document.getElementById('message-box')

let addMessageToDom = (name, message) => {


    let newMessage = `<div id="message" >
                            <p id="name"><img src="Images/mr bean2.png">  <span>${name} </span></p>
                            <p id="text">${message} </p>
                          </div>`

    messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

    // ########### point to new message always
    let lastMessage = document.querySelector('#message:last-child')
    if (lastMessage) {
        lastMessage.scrollIntoView();
    }
}


let addBotMessageToDom = (botMessage) => {

    let newMessage = `<div id="message">
                                <p id="name"><img src="Images/mr bean.png"> <span>Mr Bean</span></p>
                                <p id="text">${botMessage}</p>
                             </div>`

    messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

    let lastMessage = document.querySelector('#message:last-child')
    if (lastMessage) {
        lastMessage.scrollIntoView();
    }

}

let leaveChannel = async () => {
    await channel.leave()
    await rtmClient.logout()
}

window.addEventListener('beforeunload', leaveChannel)

let messageForm = document.getElementById('message__form')
messageForm.addEventListener('submit', sendMessage)

document.getElementById("message__form").addEventListener("submit", sendMessage)
