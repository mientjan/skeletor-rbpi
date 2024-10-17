const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Initialize express app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'control' directory
app.use(express.static(path.join(__dirname, 'control')));

// Default route to serve the index.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'control', 'index.html'));
});

// Handle socket connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for incoming instructions
    socket.on('instruction', (data) => {
        console.log('Received instruction:', data);

        // Process the instruction (you can add any logic here)
        // For example, broadcast the instruction to other clients
        io.emit('instruction', data);
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});