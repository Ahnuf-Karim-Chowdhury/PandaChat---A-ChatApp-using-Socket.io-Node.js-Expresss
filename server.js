const path = require('path');
const http = require('http');
const express = require('express');
const soketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io =soketio(server);

// making the frontend "public" folder static for connecting with the backend
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'PandaBot';

io.on('connection', socket => {
    // console.log(`New WS connection`);

    socket.emit('message', formatMessage(botName,'Welcome to PandaChat'));

    socket.broadcast.emit('message', formatMessage(botName,'A user has joined the chat'));

    socket.on('disconnect', message=>{
        io.emit('message', formatMessage(botName,'A user has left the chat'));
    });

    // io.emit();

    // listen for the chat-message from the frontend to the server
    socket.on('chatMessage', (msg)=>{
        // console.log(msg);
        io.emit('message',formatMessage('USER',msg));
    })
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=>{console.log(`server running on ${PORT} `);});