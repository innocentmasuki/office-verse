const http = require("http");
const { Server } = require("socket.io");

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendMessage', ({ room, message }) => {
    io.to(room).emit('message', message);
  });

  socket.on('joinRoom', ({ room }) => {
    console.log(`User joined room ${room}`)
    socket.join(room);
    socket.to(room).emit('joinedRoom', room);
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(room);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
