const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');
const { count } = require('console');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));

const sockets = {},
    users = {};

let strangerQueue = false,
    peopleActive = 0;

const createConnection = (socket) => {
    // if (peopleActive === 1) {
    //     console.log('No user to connect');
    //     return;
    // }
    if (strangerQueue !== false && peopleActive > 1) {
        users[socket.id].connectedTo = strangerQueue;
        users[socket.id].isTyping = false;
        users[strangerQueue].connectedTo = socket.id;
        users[strangerQueue].isTyping = false;
        socket.emit('connected');
        // console.log('bleh');
        sockets[strangerQueue].emit('connected');
        strangerQueue = false;
    } else {
        strangerQueue = socket.id;
    }
};

io.sockets.on('connection', (socket) => {
    // socket.emit('message', 'Welcome to muj-connect');
    // console.log(moment().format('h:mm a'));
    // socket.broadcast.emit('message', 'A user has connected');
    sockets[socket.id] = socket;
    users[socket.id] = {
        connectedTo: -1,
        isTyping: false,
    };

    peopleActive++;
    createConnection(socket);
    io.sockets.emit('people', { people: peopleActive });
    // console.log(`stats: ${peopleActive}`);

    socket.on('newStranger', () => {
        createConnection(socket);
    });

    socket.on('text', (msg) => {
        if (
            users[socket.id].connectedTo !== -1 &&
            sockets[users[socket.id].connectedTo]
        ) {
            sockets[users[socket.id].connectedTo].emit('text', msg);
        }
    });

    socket.on('typing', (isTyping) => {
        if (
            users[socket.id].connectedTo !== -1 &&
            sockets[users[socket.id].connectedTo] &&
            users[socket.id].isTyping !== isTyping
        ) {
            users[socket.id].isTyping = isTyping;
            sockets[users[socket.id].connectedTo].emit('typing', isTyping);
        }
    });

    socket.on('leave', () => {
        let stranger = users[socket.id].connectedTo;
        if (strangerQueue === socket.id || strangerQueue === stranger) {
            strangerQueue = false;
        }
        users[socket.id].connectedTo = -1;
        users[socket.id].isTyping = false;
        if (sockets[stranger]) {
            users[stranger].connectedTo = -1;
            users[stranger].isTyping = false;
            sockets[stranger].emit('leave', { user: 'stranger' });
        }
        socket.emit('leave', { user: 'you' });
    });

    // console.log(io.engine.clientsCount);
    socket.on('disconnect', (error) => {
        // console.log(peopleActive);
        let stranger = users[socket.id] && users[socket.id].connectedTo;
        if (stranger === undefined) stranger = -1;
        if (stranger !== -1 && sockets[stranger]) {
            sockets[stranger].emit('leave', {
                user: 'stranger',
                error: error && error.toString(),
            });
            users[stranger].connectedTo = -1;
            users[stranger].isTyping = false;
        }
        delete sockets[socket.id];
        delete users[socket.id];
        if (strangerQueue === socket.id || strangerQueue === stranger) {
            strangerQueue = false;
        }
        peopleActive--;
        io.sockets.emit('people', { people: peopleActive });
    });
});

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
