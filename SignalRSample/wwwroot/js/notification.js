//create connection
const connectionNotification = new signalR.HubConnectionBuilder().withUrl("/hubs/notification").build()


document.getElementById("sendButton").disabled = true

document.getElementById("sendButton").addEventListener("click", (event) => {
    const message = document.getElementById("notificationInput").value 
    connectionNotification.send("SendMessage", message).then(() => {
        document.getElementById("notificationInput").value = ""
    })
    event.preventDefault()
})


connectionNotification.on("LoadNotification", (message, counter) => {
    document.getElementById("messageList").innerHTML = ""
    let notificationCounter = document.getElementById("notificationCounter")
    notificationCounter.innerHTML = "<span>(" + counter + ")</span>"
    for (let i = message.length - 1; i >= 0; i--) {
        const li = document.createElement("li")
        li.textContent = "Notification - " + message[i]
        document.getElementById("messageList").appendChild(li)
    }
})

//start connection
function fulfilled() {
    //do something on start
    console.log("Connection to Notification Hub Succesful")
    document.getElementById("sendButton").disabled = false
    connectionNotification.send("LoadMessages")
}

function rejected() {
    //rejected logs
}

connectionNotification.start().then(fulfilled, rejected)