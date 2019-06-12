let socket = io();
socket.on("message", function (data) {
    console.log(data);
});

let movement = {
    up: false,
    down: false,
    left: false,
    right: false
}
document.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = true;
            break;
        case 87: // W
            movement.up = true;
            break;
        case 68: // D
            movement.right = true;
            break;
        case 83: // S
            movement.down = true;
            break;
        case 37: // Left
            movement.left = true;
            break;
        case 38: // Up
            movement.up = true;
            break;
        case 39: // Right
            movement.right = true;
            break;
        case 40: // Down
            movement.down = true;
            break;

    }
});
document.addEventListener("keyup", function (event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = false;
            break;
        case 87: // W
            movement.up = false;
            break;
        case 68: // D
            movement.right = false;
            break;
        case 83: // S
            movement.down = false;
            break;
        case 37: // Left
            movement.left = false;
            break;
        case 38: // Up
            movement.up = false;
            break;
        case 39: // Right
            movement.right = false;
            break;
        case 40: // Down
            movement.down = false;
            break;
    }
});

let name = "";
let modal = $("#myModal")[0];
getNameModal();


setInterval(function () {
    socket.emit("movement", movement);
}, 1000 / 60);

let canvas = $("#canvas")[0];
canvas.width = 1280;
canvas.height = 720;
let context = canvas.getContext("2d");
socket.on("state", function (players) {
    context.clearRect(0, 0, 1280, 720);
    $("#scoreboard-names").empty();
    for (let id in players) {
        let player = players[id];
        context.beginPath();
        context.arc(player.x, player.y, player.size, 0, 2 * Math.PI);
        context.fillStyle = player.color;
        context.fillText(player.name, player.x, player.y - (player.size + 7));
        context.textAlign = "center";
        context.fill();
        updateScoreboard(player);
    }
});

socket.on("death", function () {
    getNameModal();
});


function getNameModal() {
    // Get the modal
    modal.style.display = "block";
}

function getUserName() {
    let nameField = $("#nameField").val();
    modal.style.display = "none";
    name = nameField;
    socket.emit("new player", name);
}

function updateScoreboard(player) {
    let scoreboard = $("#scoreboard-names");
    scoreboard.append(
        '<div class="row">' +
            `<div class="col"><h6>${player.name}</h6></div>` +
            `<div class="col"><h6>${player.score}</h6></div>` +
        '</div>'
    );
}