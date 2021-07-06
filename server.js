const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages.js");
const { userJoin, getCurrentUser } = require("./utils/users");

const botName = "Bot Monitor";
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// static folders
app.use(express.static(path.join(__dirname, "public")));

// triggered when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit("message", formatMessage(botName, "Welcome To Chat!"));
  });

  console.log("new connection");

  //   broadcast when connection established
  socket.broadcast
    .to(user.room)
    .emit(
      "message",
      formatMessage(botName, `${user.username} has entered chat`)
    );

  // broadcast on disconnect
  socket.on("disconnect", () => {
    io.emit(
      "message",
      formatMessage(botName, `${user.username} has left chat`)
    );
  });

  //   listen for chat message from front end
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    io.emit("message", formatMessage("USER", msg));
  });
});

const PORT = 3005 || process.env.PORT;
server.listen(PORT, () => console.log(`server running on ${PORT}`));
