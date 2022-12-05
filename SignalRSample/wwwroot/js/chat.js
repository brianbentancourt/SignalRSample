
const connectionChat = new signalR
    .HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .build()

document.getElementById("sendMessage").disabled = true

document.getElementById("sendMessage").addEventListener("click", (event) => {
    const sender = document.getElementById("senderEmail").value
    const message = document.getElementById("chatMessage").value
    const receiver = document.getElementById("receiverEmail").value

    if (receiver.length > 0) {
        //send message to receiver
        connectionChat.invoke("SendMessageToReciever", sender, receiver, message).catch((err) => console.error(err))
    } else {
        //send message to all users
        connectionChat.send("SendMessageToAll", sender, message).catch((err) => console.error(err))
    }

    event.preventDefault()

})


connectionChat.on("MessageReceived", (user, message) => {
    const li = document.createElement("li")
    document.getElementById("messagesList").appendChild(li)
    li.textContent = `${user} - ${message}`
})


//start connection

function fulfilled() {
    //do something on start
    console.log("Connection to Chat Hub Succesful")
    document.getElementById("sendMessage").disabled = false
}

function rejected() {
    //rejected logs
}
connectionChat.start().then(fulfilled, rejected)