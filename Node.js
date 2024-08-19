const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Handle new connections
io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('message', (message) => {
        io.emit('message', message); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// API routes
app.post('/signup', (req, res) => {
    // Handle user signup
});

server.listen(5000, () => console.log('Server running on port 5000'));
