const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));

const sockets = {},
    users = {};

let strangerQueue = false,
    peopleActive = 0;

io.sockets.on('connection', (socket) => {
    // socket.emit('message', 'Welcome to muj-connect');
    // console.log(moment().format('h:mm a'));
    // socket.broadcast.emit('message', 'A user has connected');
    sockets[socket.id] = socket;
    users[socket.id] = {
        connectedTo: -1,
        isTyping: false,
    };

    if (strangerQueue !== false) {
        users[socket.id].connectedTo = strangerQueue;
        users[socket.id].isTyping = false;
        users[strangerQueue].connectedTo = socket.id;
        users[strangerQueue].isTyping = false;
        socket.emit('connected');
        console.log('bleh')
        sockets[strangerQueue].emit('connected');
        strangerQueue = false;
    } else {
        strangerQueue = socket.id;
    }
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    });
    // console.log(io.engine.clientsCount);
    socket.on('disconnect', () => {
        io.emit('message', 'User has disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
