const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));

const sockets = {};

io.sockets.on('connection', (socket) => {
    socket.emit('message', 'Welcome to muj-connect');
    sockets[socket.id] = socket;
    console.log(sockets);
    socket.broadcast.emit('message', 'A user has connected');

    // console.log(io.engine.clientsCount);
    socket.on('disconnect', () => {
        io.emit('message', 'User has disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
