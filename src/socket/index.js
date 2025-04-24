const { Server } = require("socket.io");

function setupWebSocket(socket) {
  const io = new Server(socket, {
    path: "/api/ws/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  return io;
}

module.exports = setupWebSocket;
