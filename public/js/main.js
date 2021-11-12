const socket = io();

const send = document.getElementById('form');
socket.on('message', (message) => {
    console.log(message);
});

socket.on('connect', () => {
    console.log('Waiting');
    //Disable the Disconenct/next button
});

socket.on('connected', () => {
    //Enable Disconnect/next button
    console.log('Connected to a user');
});

send.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.input.value;
    socket.emit('chatMessage', msg);
});
