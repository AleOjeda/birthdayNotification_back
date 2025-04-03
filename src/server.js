const http = require("http");
const app = require("./app");
const setupWebSocket = require("./socket");
//Necesario porque websocket necesita explicitamente crear un servidor. Si fuera solo API app.listin tiene un hppt.createServer implicito.
const server = http.createServer(app);

//Configura websockets
const io = setupWebSocket(server);
// const client = require("./services/whatsappService");

const { initWhatsapp } = require("./services/whatsappService");
initWhatsapp(io);

const PORT = process.env.PORT || 3001;
//Server y app.listen en el mismo puerto. por comando de arriba donde crea un server con http.createServer(app)
//Levanta servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
