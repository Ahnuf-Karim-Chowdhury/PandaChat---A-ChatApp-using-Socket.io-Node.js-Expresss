const chatform = document.getElementById("chat-form");

const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

// submit
chatform.addEventListener("submit", (e) => {
  e.preventDefault();

  // getting the chat-message from the frontend by the id
  const msg = e.target.elements.msg.value;

  // console.log(msg);


  // sending the chat-message to the server
  socket.emit('chatMessage', msg);


});
