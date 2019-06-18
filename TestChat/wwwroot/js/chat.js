"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + ":\t" + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("submitName").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    if (user.length != 0) {
        this.hidden = true;
        document.getElementById("ask-for-name").innerText = document.getElementById("userInput").value + "'s Profile";
        document.getElementById("userInput").disabled = true;
        document.getElementById("messageBlock").hidden = false;
        document.getElementById("messageInput").focus();
    }
});

document.getElementById("userInput").addEventListener("keypress", function (e) {
    if (e.keyCode === 13) {
        document.getElementById("submitName").click();
    }
});

document.getElementById("messageInput").addEventListener("keypress", function (e) {
    if (e.keyCode === 13) {
        document.getElementById("sendButton").click();
        this.value = "";
    }
});

