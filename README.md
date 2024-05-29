# Chess Game
This project is a real-time, two-player chess game built with Node.js, Express, Socket.io, and the Chess.js library.

## Features
- Real-time updates using *Socket.io*
- Drag-and-drop interface for moving pieces
- Automatic role assignment (white, black, spectator), 
- Visual representation of the chessboard and pieces
- Responsive design for various screen sizes

## Technologies Used
- **Node JS**
- **Express JS**
- **Socket.io**
- **Chess.js**
- **EJS Template Engine**
- **HTML/CSS**

## Usage

- The first two users to connect will be assigned as the white (1st user) and black (2nd user) players.
- Any additional users will be assigned as spectators..
- The board state is synchronized across all connected clients.