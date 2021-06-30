const chatForm = document.getElementById("chat-form");
const socket = io();
const chatMessages = document.querySelector(".chat-messages");

// get username and room
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefrix: true,
});

// join chatRoom
socket.emit("joinRoom", { username, room });

// server message
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  //   sends value of chat box to backend
  socket.emit("chatMessage", msg);

  // clears text field
  e.target.elements.msg.value("");
  e.target.elements.msg.focus();
});

// output message to screen/dom
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
  <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
 ${message.text}
  </p>
  
  
  `;

  document.querySelector(".chat-messages").appendChild(div);
}
