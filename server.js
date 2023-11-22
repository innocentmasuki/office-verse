const http = require("http");
const { Server } = require("socket.io");

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://10.0.254.232:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

function getUniqueCharacters(characters) {
  const latestCharacters = new Map();
  
  for (const character of characters) {
      latestCharacters.set(character.id, character);
  }
  
  const uniqueCharacters = Array.from(latestCharacters.values());
  console.log(JSON.stringify(uniqueCharacters, null, 2))
  return uniqueCharacters;
  }


io.on('connection', (socket) => {
  console.log('A user connected');
  var characters = []

  socket.on('sendMessage', ({ room, message }) => {
    io.to(room).emit('message', message);
  });

  socket.on('joinRoom', ({ room }) => {
    console.log(`User joined room ${room}`)
    socket.join(room);
    socket.to(room).emit('joinedRoom', room);
  });

  socket.on('newUser', (user) => {
    characters.push(user)
    socket.emit('characters',getUniqueCharacters(characters))
    console.log("=>",JSON.stringify(getUniqueCharacters(characters),null,2))
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(room);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
