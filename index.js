const express = require("express");
const http = require("http");
const path = require("path")
const socket = require("socket.io");
const { Chess } = require("chess.js");
const { title } = require("process");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();

app.set("view engine", "ejs");
app.use(express.static("public"));

// Variables
let player = {};
let currentPlayer = "w";

app.get('/', (req, res) => {
    res.render("index", { title: "Chess" });
})

const port = 3000
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

// Socket.io setup
io.on("connection", (uniqueSocket) => {

    // Declaring player's role
    if (!player.white) {
        player.white = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "w");
    }
    else if (!player.black) {
        player.black = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "b");
    }
    else {
        uniqueSocket.emit("spectatorRole");
    }

    // What will happen when player disconnects
    uniqueSocket.on("disconnect", () => {
        if (uniqueSocket.id === player.white) {
            delete player.white;
        }
        else if (uniqueSocket.id === player.black) {
            delete player.black;
        }
    })

    // Checking if the move is valid 
    uniqueSocket.on("move", (move) => {
        try {
            if (chess.turn() === "w" && uniqueSocket.id !== player.white) return; // if (chess.turn() === "b" && uniqueSocket.id === player.black) return;
            if (chess.turn() === "b" && uniqueSocket.id !== player.black) return; // if (chess.turn() === "b" && uniqueSocket.id === player.white) return;

            // Registering valid move
            const result = chess.move(move);
            if (result) {
                currentPlayer = chess.turn();
                io.emit("move", move);
                io.emit("boardState", chess.fen());
            } else{
                console.log("Invalid move: ", move);
                uniqueSocket.emit("Invalid move: ", move);
            }
        } catch (error) {
            console.log(error);
        }
    })
})