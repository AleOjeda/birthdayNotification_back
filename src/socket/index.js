const { Server } = require("socket.io");

function setupWebSocket(socket) {
  const io = new Server(socket, {
    path: "/api/ws/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);
    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });
  return io;
}

module.exports = setupWebSocket;
