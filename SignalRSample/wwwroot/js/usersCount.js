
//create connection
const connectionUserCount = new signalR
    .HubConnectionBuilder()
//    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .withUrl("/hubs/userCount", signalR.HttpTransportType.WebSockets)
    .build()


//connect to methods that hub invokes aka recevie notifications from hub
connectionUserCount.on("updateTotalViews", (value) => {
    const newCountSpan = document.getElementById("totalViewsCounter")
    newCountSpan.innerText = value.toString()
})



connectionUserCount.on("updateTotalUsers", (value) => {
    const newCountSpan = document.getElementById("totalUsersCounter")
    newCountSpan.innerText = value.toString()
})

//invoke hub methods aka send notification to hub
function newWindowLoadedClient() {
    connectionUserCount.invoke("NewWindowLoaded","John").then((value) => console.log(value))
}

//start connection
function fulfilled() {
    //do something on start
    console.log("Connection to User Hub Succesful")
    newWindowLoadedClient()
    document.getElementById("connectionState").innerText = "Connected"
}


function rejected() {
    //rejected logs
}

connectionUserCount.onclose((error) => {
    document.getElementById("connectionState").innerText ="Disconnected"
})

connectionUserCount.onreconnected((connectionId) => {
    document.getElementById("connectionState").innerText = "Connected"
})

connectionUserCount.onreconnecting((error) => {
    document.getElementById("connectionState").innerText = "Reconnecting..."
})

connectionUserCount.start().then(fulfilled, rejected)