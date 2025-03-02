require("dotenv").config();
const app = require("./app");
const http = require("http");

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

// Socket.IO on the HTTP server
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST"],
  },
});

// event listeners to Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.set("io", io);

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

// require("dotenv").config();
// const app = require("./app");

// const PORT = process.env.PORT || 4000;

// app.listen(process.env.PORT, () => {
//   console.log("Server running on port " + PORT);
// });
