const socket = io();

socket.on('message', (message) => {
    console.log(message);
});

socket.on('socket', (sockets) => {
    console.log(sockets);
});
