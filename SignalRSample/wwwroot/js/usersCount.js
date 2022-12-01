
//create connection
const connectionUserCount = new signalR
    .HubConnectionBuilder()
//    .configureLogging(signalR.LogLevel.Information)
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
}


function rejected() {
    //rejected logs
}

connectionUserCount.start().then(fulfilled, rejected)