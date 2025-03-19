const path = require('path');
const http = require('http');
const express = require('express');
const soketio = require('socket.io')

const app = express();
const server = http.createServer(app);
const io =soketio(server);

// making the frontend "public" folder static for connecting with the backend
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log(`New WS connection`);

    socket.emit('message', 'Welcome to PandaChat');
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=>{console.log(`server running on ${PORT} `);});