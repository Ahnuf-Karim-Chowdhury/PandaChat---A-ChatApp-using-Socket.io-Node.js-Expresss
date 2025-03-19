const chatform = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages') ;

const socket = io();

// Message from server to the frontend
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //every time a message is sent scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;

});

// submit
chatform.addEventListener("submit", (e) => {
  e.preventDefault();

  // getting the chat-message from the frontend by the id
  const msg = e.target.elements.msg.value;

  // console.log(msg);


  // sending the chat-message to the server
  socket.emit('chatMessage', msg);

  // clear the input text field
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus() ;

});

// output Message to DOM
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class='meta'>John <span>9:12pm</span></p>
  <p class='text'> ${message} </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}