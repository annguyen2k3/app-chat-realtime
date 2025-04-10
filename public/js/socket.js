// Initialize socket connection
const socket = io();

// Handle connection
socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
});
