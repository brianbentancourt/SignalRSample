let lbl_houseJoined = document.getElementById("lbl_houseJoined");


let btn_un_gryffindor = document.getElementById("btn_un_gryffindor");
let btn_un_slytherin = document.getElementById("btn_un_slytherin");
let btn_un_hufflepuff = document.getElementById("btn_un_hufflepuff");
let btn_un_ravenclaw = document.getElementById("btn_un_ravenclaw");
let btn_gryffindor = document.getElementById("btn_gryffindor");
let btn_slytherin = document.getElementById("btn_slytherin");
let btn_hufflepuff = document.getElementById("btn_hufflepuff");
let btn_ravenclaw = document.getElementById("btn_ravenclaw");

let trigger_gryffindor = document.getElementById("trigger_gryffindor");
let trigger_slytherin = document.getElementById("trigger_slytherin");
let trigger_hufflepuff = document.getElementById("trigger_hufflepuff");
let trigger_ravenclaw = document.getElementById("trigger_ravenclaw");


//create connection
const connectionHouseGroup = new signalR
    .HubConnectionBuilder()
    .withUrl("/hubs/housegroup")
    .build()

////////////

btn_gryffindor.addEventListener("click", (event) => {
    connectionHouseGroup.send("JoinHouse","Gryffindor")
    event.preventDefault()
})

btn_hufflepuff.addEventListener("click", (event) => {
    connectionHouseGroup.send("JoinHouse", "Hufflepuff")
    event.preventDefault()
})

btn_ravenclaw.addEventListener("click", (event) => {
    connectionHouseGroup.send("JoinHouse", "Ravenclaw")
    event.preventDefault()
})

btn_slytherin.addEventListener("click", (event) => {
    connectionHouseGroup.send("JoinHouse", "Slytherin")
    event.preventDefault()
})


btn_un_gryffindor.addEventListener("click", (event) => {
    connectionHouseGroup.send("LeaveHouse", "Gryffindor")
    event.preventDefault()
})

btn_un_hufflepuff.addEventListener("click", (event) => {
    connectionHouseGroup.send("LeaveHouse", "Hufflepuff")
    event.preventDefault()
})

btn_un_ravenclaw.addEventListener("click", (event) => {
    connectionHouseGroup.send("LeaveHouse", "Ravenclaw")
    event.preventDefault()
})

btn_un_slytherin.addEventListener("click", (event) => {
    connectionHouseGroup.send("LeaveHouse", "Slytherin")
    event.preventDefault()
})

trigger_gryffindor.addEventListener("click", (event) => {
    connectionHouseGroup.send("TriggerHouseNotify", "Gryffindor")
    event.preventDefault()
})

trigger_hufflepuff.addEventListener("click", (event) => {
    connectionHouseGroup.send("TriggerHouseNotify", "Hufflepuff")
    event.preventDefault()
})

trigger_ravenclaw.addEventListener("click", (event) => {
    connectionHouseGroup.send("TriggerHouseNotify", "Ravenclaw")
    event.preventDefault()
})

trigger_slytherin.addEventListener("click", (event) => {
    connectionHouseGroup.send("TriggerHouseNotify", "Slytherin")
    event.preventDefault()
})

//connect to methods that hub invokes aka recevie notifications from hub
connectionHouseGroup.on("triggerHouseNotification", (houseName) => {
    toastr.success(`A new notification for ${houseName} has been launched`)
})

connectionHouseGroup.on("newMemberAddedToHouse", (houseName) => {
    toastr.success(`Member has suscribed to. ${houseName}`)
})

connectionHouseGroup.on("newMemberRemovedFromHouse", (houseName) => {
    toastr.warning(`Member has unsuscribed from. ${houseName}`)
})

connectionHouseGroup.on("subscriptionStatus", (strGroupsJoined, houseName, hasSuscribed) => {
    lbl_houseJoined.innerText = strGroupsJoined

    if (hasSuscribed) {
        //suscribe to 
        switch (houseName) {
            case 'gryffindor':
                btn_gryffindor.style.display = "none"
                btn_un_gryffindor.style.display = ""
                break;
            case 'hufflepuff':
                btn_hufflepuff.style.display = "none"
                btn_un_hufflepuff.style.display = ""
                break;
            case 'ravenclaw':
                btn_ravenclaw.style.display = "none"
                btn_un_ravenclaw.style.display = ""
                break;
            case 'slytherin':
                btn_slytherin.style.display = "none"
                btn_un_slytherin.style.display = ""
                break;
            default:
                break;
        }
        toastr.success(`You have suscribed successfully. ${houseName}`)
    } else {
        //unsuscribe
        switch (houseName) {
            case 'gryffindor':
                btn_gryffindor.style.display = ""
                btn_un_gryffindor.style.display = "none"
                break;
            case 'hufflepuff':
                btn_hufflepuff.style.display = ""
                btn_un_hufflepuff.style.display = "none"
                break;
            case 'ravenclaw':
                btn_ravenclaw.style.display = ""
                btn_un_ravenclaw.style.display = "none"
                break;
            case 'slytherin':
                btn_slytherin.style.display = ""
                btn_un_slytherin.style.display = "none"
                break;
            default:
                break;
        }
        toastr.success(`You have unsuscribed successfully. ${houseName}`)
    }
})


//start connection

function fulfilled() {
    //do something on start
    console.log("Connection to HouseGroup Hub Succesful")
}

function rejected() {
    //rejected logs
}

connectionHouseGroup.start().then(fulfilled, rejected)