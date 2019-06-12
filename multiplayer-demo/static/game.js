let socket = io();
socket.on("message", function (data) {
    console.log(data);
});

// movement struct
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
getNameModal(true);


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

socket.on("death", function (pScore) {
    getNameModal(false, pScore);
});


function getNameModal(isNewPlayer, pScore) {
    let button = $("#form-button");
    // Get the modal
    modal.style.display = "block";
    button.empty();
    if (isNewPlayer) {
        button.append('<button id="aButton" onclick="getUserName(0)" type="button">Play!</button>');
    } else {
        button.append(`<button id="aButton" onclick="getUserName(${pScore})" type="button">Play!</button>` +
        `<button onclick="getUserName(0)" type="button">Reset Score</button>`);
    }

    $("#nameField").keypress(function (e) {
        var key = e.which;
        if(key == 13)  // the enter key code
         {
           $('button[id = aButton]').click();
           return false;  
         }
       });
}

function getUserName(pScore) {
    let nameField = $("#nameField").val();
    modal.style.display = "none";
    name = nameField;
    socket.emit("new player", name, pScore);
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