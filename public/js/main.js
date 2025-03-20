const chatform = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages') ;
// Select the "Leave Room" button
const leaveBtn = document.getElementById("leave-btn");

// Add a click event listener
leaveBtn.addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chat room?");
  if (leaveRoom) {
    
    window.location = 'http://localhost:3000'; 
  }
});


// getting username & room from the URL
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true,

});
//console.log(location.search);

//console.log(username,room);

const socket = io();

// join chat room
socket.emit('joinRoom', {username,room});

// Message from server to the frontend
socket.on("message", (message) => {
  // console.log(message);
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
  div.innerHTML = `<p class='meta'>${message.name} <span>${message.time}</span></p>
  <p class='text'> ${message.text} </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}