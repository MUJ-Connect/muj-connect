const socket = io();

const form = document.getElementById('form');
const button = document.getElementById('button');
socket.on('message', (message) => {
    console.log(message);
});

socket.on('connect', () => {
    console.log('Waiting for a stranger');
    //Disable the Disconenct/next button
});

socket.on('connected', () => {
    //Enable Disconnect/next button
    console.log('Connected to a user');
});

button.addEventListener('click', (e) => {
    // console.log(e.target.value);
    if (e.target.innerHTML === 'New Stranger') {
        //Will be used to find new chat after leaving a chat
        if (socket) {
            socket.emit('newStranger');
            e.target.innerHTML = 'Leave';
        }
    } else {
        //Will be used to leave the chat
        e.target.innerHTML = 'New Stranger';
    }
});
socket.on('people', ({ people }) => {
    const component = document.getElementById('people');
    component.innerHTML = `${people}+ people active`;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.input.value;
    socket.emit('chatMessage', msg);
    // console.log(e.target.elements);
});
