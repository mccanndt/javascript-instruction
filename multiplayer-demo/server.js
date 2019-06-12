// Dependencies
let express = require("express");
let http = require("http");
let path = require("path");
let socketIO = require("socket.io");

let app = express();
let server = http.Server(app);
let io = socketIO(server);

app.set("port", 5000);
app.use("/static", express.static(__dirname + "/static"));

// Routing
app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "index.html"));
});

// Starts the server.
server.listen(5000, function () {
  console.log("Starting server on port 5000");
});

// Add the WebSocket handlers
io.on("connection", function (socket) {
});

// JSON with all players
let players = {};
// Once connected, look for the emits from client
io.on("connection", function (socket) {
  // Runs when a new player is created
  socket.on("new player", function (pName, pScore) {
    players[socket.id] = {
      x: Math.floor((Math.random() * 1240) + 20),
      y: Math.floor((Math.random() * 680) + 20),
      color: randomColor(),
      name: pName,
      size: randomSize(),
      isGrowing: true,
      id: socket.id,
      score: pScore,
      updateScore: true
    };
  });

  // Runs on every movement emit
  socket.on("movement", function (data) {
    let player = players[socket.id] || {};
    // LEFT
    if (data.left && (!data.up && !data.down)) {
      if (player.x > 10) {
        player.x -= 5;
      }
    } else if (data.left) {
      if (player.x > 10) {
        player.x -= 3.536;
      }
    }
    // UP
    if (data.up && (!data.left && !data.right)) {
      if (player.y > 10) {
        player.y -= 5;
      }
    } else if (data.up) {
      if (player.y > 10) {
        player.y -= 3.536;
      }
    }
    // RIGHT
    if (data.right && (!data.up && !data.down)) {
      if (player.x < 1270) {
        player.x += 5;
      }
    } else if (data.right) {
      if (player.x < 1270) {
        player.x += 3.536;
      }
    }
    // DOWN
    if (data.down && (!data.left && !data.right)) {
      if (player.y < 710) {
        player.y += 5;
      }
    } else if (data.down) {
      if (player.y < 710) {
        player.y += 3.536;
      }
    }

    // Grow or shrink the player
    player.size = getPlayerSize(player.size, player);
    
    // if more than 1 players, check for collision
    if (Object.keys(players).length > 1) {
      for (let id in players) {
        if (players[id] !== player) {
          let player2 = players[id];
          if (collisionDetect(player, player2)) {
            // Check for who is bigger and add score
            if (player.size > player2.size) {
              delete players[player2.id];
              io.to(player2.id).emit("death", player2.score);
              player.score += 1;
            } else if (player.size < player2.size) {
              delete players[player.id];
              io.to(player.id).emit("death", player.score);
              player2.score += 1;
            }
          }
        }
      }
    }
  });

  // Remove disconnected player
  socket.on("disconnect", function () {
    delete players[socket.id];
  });
});

// sends the state command to the client 60 times per second (60FPS)
setInterval(function () {
  io.sockets.emit("state", players);
}, 1000 / 60);

// get a random player color
function randomColor() {
  let hue = Math.floor(Math.random() * 361);
  let sat = Math.floor(Math.random() * 101);
  let light = Math.floor((Math.random() * 61) + 20);
  let color = `hsl(${hue}, ${sat}%, ${light}%)`;
  return color;
}

// Sizes for the player when shrinking and growing
let maxSize = 40;
let minSize = 5;
function randomSize() {
  let rand = Math.floor(Math.random() * (maxSize - minSize - 1)) + minSize;
  return rand;
}

// Shrink / Grow the player
function getPlayerSize(currentSize, player) {
  if (currentSize < maxSize && player.isGrowing) {
    currentSize++;
    if (currentSize == maxSize) {
      player.isGrowing = false;
    }
  } else if (currentSize > minSize && !player.isGrowing) {
    currentSize--;
    if (currentSize == minSize) {
      player.isGrowing = true;
    }
  }
  return currentSize;
}

// Detect collision of 2 players
function collisionDetect(circle, circle2) {
  let distX = Math.abs(circle.x - circle2.x);
  let distY = Math.abs(circle.y - circle2.y);
  let radii = Math.abs(circle.size + circle2.size);
  if (distX > (circle2.size + circle.size)) {
    return false;
  }
  if (distY > (circle2.size + circle.size)) {
    return false;
  }
  return (distX * distX + distY * distY <= (radii * radii));
}