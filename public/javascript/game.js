const socket = io();
const chess = new Chess();

const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let squareSource = null;
let playerRole = null;

const renderBoard= () => {
    const board = chess.board();
    boardElement.innerHTML = "";
    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            let squareElement = document.createElement("div");

            // Defining the square color
            squareElement.classList.add(
                "square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
            );

            // Adding dataset attribute in the div = squareElement
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            // Defining the piece color
            const pieceElement = document.createElement("div");
            if (square) {
                // Defining the piece color
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );


                // Defining the piece unicode
                pieceElement.innerText = pieceUnicode(square);

                // Drag-and-drop feature
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        squareSource = { row: rowIndex, col: squareIndex };
                        e.dataTransfer.setData("text/plain", ""); // For flawless drag-and-drop across different browsers.
                    }
                });
                pieceElement.addEventListener("dragend", () => {
                    if (pieceElement.draggable) {
                        draggedPiece = null;
                        squareSource = null;
                    }
                });

                // Append piece unicode in the squares
                squareElement.appendChild(pieceElement);
            }

            // Prevent unusual drags
            squareElement.addEventListener("dragover", (e) => {
                e.preventDefault();
            })

            // Dropping the piece in a square
            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col)
                    };
                    handleMove(squareSource, targetSquare);
                }
            });
            
            boardElement.appendChild(squareElement);

        });
    });

    if(playerRole === "b"){
        boardElement.classList.add("flipped");
    } else{
        boardElement.classList.remove("flipped");
        let pieces = document.querySelectorAll(".piece");
        pieces.forEach((e)=>{
            e.style.transform = "rotate(0deg)";
        })
        
    }
}

function handleMove(source, target) {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: "q"
    };

    socket.emit("move", move);
}

const pieceUnicode = (piece) => {
    const unicode = { p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔" }
    return unicode[piece.type] || "";
}

// Sending to backend
socket.on("playerRole", (role)=>{
    playerRole = role;
    renderBoard();
});

socket.on("spectatorRole", ()=>{
    playerRole = null;
    renderBoard();
})

socket.on("boardState", (fen)=>{
    chess.load(fen);
    renderBoard();
})

socket.on("move", (move)=>{
    chess.move(move);
    renderBoard();
})

renderBoard();