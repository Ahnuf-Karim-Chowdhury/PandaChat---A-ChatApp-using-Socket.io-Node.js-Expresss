const chatform = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const leaveBtn = document.getElementById("leave-btn");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Add a click event listener
leaveBtn.addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chat room?");
  if (leaveRoom) {
    window.location = "http://localhost:3000";
  }
});

// getting username & room from the URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
//console.log(location.search);

//console.log(username,room);

const socket = io();

// join chat room
socket.emit("joinRoom", { username, room });

// Get Room & Users
socket.on(`roomUsers`, ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

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
  socket.emit("chatMessage", msg);

  // clear the input text field
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// output Message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add(
    "message",
    "bg-gray-500",
    "text-white",
    "rounded-lg",
    "p-4",
    "mb-3",
    "max-w-lg",
    "self-start",
    "break-words",
    "shadow-md"
  );

  div.innerHTML = `
    <p class="meta font-semibold text-sm text-gray-300 mb-1">
      ${message.name} <span class="text-gray-300 text-xs text-right">${message.time}</span>
    </p>
    <p class="text leading-relaxed">
      ${message.text}
    </p>
  `;

  document.querySelector(".chat-messages").appendChild(div);
}


// Add Room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add Users to DOM
function outputUsers(users) {
  userList.innerHTML = `
 ${users.map((user) => `<li>${user.username}</li>`).join('')}
 `;
}
