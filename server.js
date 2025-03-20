const path = require("path");
const http = require("http");
const express = require("express");
const soketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeaveRoom,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = soketio(server);

// making the frontend "public" folder static for connecting with the backend
app.use(express.static(path.join(__dirname, "public")));

const botName = "PandaBot";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    // Join the chatRoom
    socket.join(user.room);

    // Greeting Message to the New User
    socket.emit("message", formatMessage(botName, "Welcome to PandaChat"));

    // Letting the Rest of the Chat know New User in
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // send users & room info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room),
    });


    // listen for the chat-message from the frontend to the server
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // User Left Chat Room
    socket.on("disconnect", (message) => {
      const user = userLeaveRoom(socket.id);

      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`)
        );
      }
    });
  }); // the `joinRoom` function end
}); // the `connection` function end

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`server running on ${PORT} `);
});
