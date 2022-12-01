//create connection
const connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").build()

//connect to methods that hub invokes aka recevie notifications from hub
connectionUserCount.on("updateTotalViews", (value) => {
    const newCountSpan = document.getElementById("totalViewsCounter")
    newCountSpan.innerText = value.toString()
})

//invoke hub methods aka send notification to hub
function newWindowLoadedClient() {
    connectionUserCount.send("NewWindowLoaded")
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