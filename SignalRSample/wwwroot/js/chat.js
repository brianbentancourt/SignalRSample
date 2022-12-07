
const connection = new signalR
    .HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect([0,1000,5000,null])
    .build()

connection.on("ReceiveUserConnected", (userId, userName, ) => {
    addMessage(`${userName} has a connection open`)
})

connection.on("ReceiveUserDisconnected", (userId, userName) => {
    addMessage(`${userName} has closed a connection`)
})

connection.on("ReceiveAddRoomMessage", (maxRoom, roomId, roomName, userId, userName) => {
    addMessage(`${userName} has created room ${roomName}`)
    fillRoomDropDown()
})

connection.on("ReceiveDeleteRoomMessage", (deleted, selected, roomName, userName) => {
    addMessage(`${userName} has deleted room ${roomName}`)
    fillRoomDropDown()
})

connection.on("ReceivePublicMessage", (roomId, userId, userName, message, roomName) => {
    addMessage(`[Public message - ${roomName}] ${userName} says ${message}`)
})

connection.on("ReceivePrivateMessage", (senderId, senderName, receiverId, receiverName, message, chatId) => {
    addMessage(`[Private message to ${receiverName}] ${senderName} says ${message}`)
})


function sendPublicMessage() {
    const inputMsg = document.getElementById('txtPublicMessage')
    const ddlSelRoom = document.getElementById('ddlSelRoom')

    const roomId = ddlSelRoom.value
    const roomName = ddlSelRoom.options[ddlSelRoom.selectedIndex].text
    const message = inputMsg.value 

    connection.send("SendPublicMessage", Number(roomId), message, roomName)
    inputMsg.value = ''
}


function sendPrivateMessage() {
    const inputMsg = document.getElementById('txtPrivateMessage')
    const ddlSelUser = document.getElementById('ddlSelUser')

    const receiverId = ddlSelUser.value
    const receiverName = ddlSelUser.options[ddlSelUser.selectedIndex].text
    const message = inputMsg.value

    connection.send("SendPrivateMessage", receiverId, message, receiverName)
    inputMsg.value = ''
}

function addMessage(msg) {
    if (msg == null && msg == '')
        return

    let ui = document.getElementById('messagesList')
    let li = document.createElement('li')

    li.innerHTML = msg
    ui.appendChild(li)
}

function addnewRoom(maxRoom) {

    const createRoomName = document.getElementById('createRoomName')

    const roomName = createRoomName.value

    if (roomName == null && roomName == '') {
        return
    }

    /*POST*/
    $.ajax({
        url: '/ChatRooms/PostChatRoom',
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ id: 0, name: roomName }),
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            /*ADD ROOM COMPLETED SUCCESSFULLY*/
            connection.send("SendAddRoomMessage",maxRoom,json.id,json.name)

            createRoomName.value = ''


        },
        error: function (xhr) {
            alert('error')
        }
    })

}

function deleteRoom() {

    const ddlDelRoom = document.getElementById('ddlDelRoom')

    const roomName = ddlDelRoom.options[ddlDelRoom.selectedIndex].text

    const text = `Do you want to delete chat room ${roomName}?`    

    if (confirm(text) == false)
        return

    if (roomName == null && roomName == '') {
        return
    }

    const roomId = ddlDelRoom.value

    /*DELETE*/
    $.ajax({
        url: `/ChatRooms/DeleteChatRoom/${roomId}`,
        dataType: "json",
        type: "DELETE",
        contentType: 'application/json;',
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            /*DELETE ROOM COMPLETED SUCCESSFULLY*/
            connection.send("SendDeleteRoomMessage", json.deleted, json.selected, roomName)
            fillRoomDropDown()

        },
        error: function (xhr) {
            alert('error')
        }
    })
}


document.addEventListener('DOMContentLoaded', (event) => {
    fillRoomDropDown()
    fillUserDropDown()
})


function fillUserDropDown() {

    $.getJSON('/ChatRooms/GetChatUsers')
        .done(function (json) {

            var ddlSelUser = document.getElementById("ddlSelUser")

            ddlSelUser.innerText = null

            json.forEach(function (item) {
                var newOption = document.createElement("option")

                newOption.text = item.userName  //item.whateverProperty
                newOption.value = item.id
                ddlSelUser.add(newOption)


            })

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error
            console.log("Request Failed: " + jqxhr.detail)
        })

}

function fillRoomDropDown() {

    $.getJSON('/ChatRooms/GetChatRooms')
        .done(function (json) {
            var ddlDelRoom = document.getElementById("ddlDelRoom")
            var ddlSelRoom = document.getElementById("ddlSelRoom")

            ddlDelRoom.innerText = null
            ddlSelRoom.innerText = null

            json.forEach(function (item) {
                var newOption = document.createElement("option")

                newOption.text = item.name
                newOption.value = item.id
                ddlDelRoom.add(newOption)


                var newOption1 = document.createElement("option")

                newOption1.text = item.name
                newOption1.value = item.id
                ddlSelRoom.add(newOption1)

            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error
            console.log("Request Failed: " + jqxhr.detail)
        })

}


connection.start()