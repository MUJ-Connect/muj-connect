const socket = io();

const form = document.getElementById('form');
const button = document.getElementById('button');
let isTyping = false;

socket.on('text', (message) => {
    console.log(`Stranger:${message}`);
});

socket.on('connect', () => {
    console.log('Waiting for a stranger');
    //Disable the Disconenct/next button
});

socket.on('connected', () => {
    //Enable Disconnect/next button
    console.log('Connected to a user');
    button.innerHTML = 'Leave';
});

button.addEventListener('click', (e) => {
    // console.log(e.target.value);
    if (e.target.innerHTML === 'New Stranger' && socket) {
        //Will be used to find new chat after leaving a chat
        socket.emit('newStranger');
        // console.log('bleh');
    } else if (e.target.innerHTML === 'Leave' && socket) {
        //Will be used to leave the chat
        socket.emit('leave');
    }
});

socket.on('people', ({ people }) => {
    const component = document.getElementById('people');
    component.innerHTML = `${people}+ people active`;
});

socket.on('typing', (typing) => {
    if (typing) {
        console.log('stranger typing');
    } else {
        console.log('stopped');
    }
});

socket.on('leave', ({ user, error }) => {
    button.innerHTML = 'New Stranger';
    console.log(`${user} disconnected!`);
    if (error) {
        console.log(`reason: ${error}`);
    }
});

const sendText = (msg) => {
    if (msg.length > 0) {
        if (isTyping) {
            socket.emit('typing', false);
        }
        isTyping = false;
        socket.emit('text', msg);
        console.log(`Me:${msg}`);
    }
};

form.addEventListener('keyup', (e) => {
    const keyCode = e.key;
    if (keyCode !== 'Enter') {
        // console.log(keyCode);
        // console.log(e.path[0].value);
        if (socket) {
            if (e.path[0].value === '' && isTyping) {
                socket.emit('typing', false);
                isTyping = false;
            } else if (!isTyping && e.path[0].value.length > 0) {
                socket.emit('typing', true);
                isTyping = true;
            }
        }
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const elem = e.target.elements.input;
    sendText(elem.value);
    elem.value = '';
    elem.focus();
    // console.log(msg);
});
