const path = require('path');
const express = require('express');
const http = require('http')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;


app.use(express.static(path.join(__dirname, 'public')));

let a = 0;
io.sockets.on('connection', socket => {
    console.log(socket.id);
})


server.listen(PORT,() => {
    console.log(`Listening on ${PORT}`)
});
