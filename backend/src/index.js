require("dotenv").config();
const app = require("./app");
const http = require("http");

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST"],
  },
});

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
