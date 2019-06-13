let socket = io();
socket.on("message", function (data) {
    console.log(data);
});

// Movement struct
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

// Show the modal popup and get the player name
let name = "";
let modal = $("#myModal")[0];
getNameModal(true);

// Sends the "movement" command to the server 60 times a sceond (60FPS)
setInterval(function () {
    socket.emit("movement", movement);
}, 1000 / 60);

// Canvas set up
let canvas = $("#canvas")[0];
canvas.width = 1280;
canvas.height = 720;
let context = canvas.getContext("2d");

// Run on every state emit (from server)
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

// Run on every death emit (from server)
socket.on("death", function (pScore) {
    getNameModal(false, pScore);
});

// Shows the modal and accepts arguemnts for a
// new connection and an optional score if they died
function getNameModal(isNewPlayer, pScore) {
    let button = $("#form-button");
    // Show the modal
    modal.style.display = "block";
    // Generate buttons depeending on new player or death
    button.empty();
    if (isNewPlayer) {
        button.append('<button id="aButton" onclick="getUserName(0)" type="button">Play!</button>');
    } else {
        button.append(`<button id="aButton" onclick="getUserName(${pScore})" type="button">Play!</button>` +
        `<button onclick="getUserName(0)" type="button">Reset Score</button>`);
    }

    // Checks for "Enter" key press while in the modal
    $("#nameField").keypress(function (e) {
        let key = e.which;
        if(key == 13)  // the enter key code
         {
           $('button[id = aButton]').click();
           return false;  
         }
    });
    $("#aButton").focus();
}

// After modal submit, get the value and send data to server
function getUserName(pScore) {
    let nameField = $("#nameField").val();
    modal.style.display = "none";
    name = nameField;
    socket.emit("new player", name, pScore);
}

// Update the scoreboard with new players and their score
function updateScoreboard(player) {
    let scoreboard = $("#scoreboard-names");
    scoreboard.append(
        '<div class="row">' +
            `<div class="col"><h6>${player.name}</h6></div>` +
            `<div class="col"><h6>${player.score}</h6></div>` +
        '</div>'
    );
}