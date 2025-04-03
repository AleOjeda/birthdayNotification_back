const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

let io; // variable para almacenar "io"
let client;
function initWhatsapp(socketIo) {
  io = socketIo;

  // Inicializar el cliente de WhatsApp
  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      // headless: false, // Para ver lo que hace Puppeteer. Antes estaba en true
      headless: true, // Para ver lo que hace Puppeteer. Antes estaba en true
      // args: ["--no-sandbox", "--disable-setuid-sandbox"], // Opciones de seguridad
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
    },
  });

  //Cuando se genera el QR
  client.on("qr", (qr) => {
    console.log("📌 QR recibido, enviando al front...");
    qrcode.toDataURL(qr, (err, url) => {
      if (err) {
        console.log("Error generando el QR:", err);
        return;
      }
      if (io) {
        io.emit("qr", url); //Enviar QR al frontend por websocket
      }
    });
  });

  // Confirmación de conexión
  client.on("ready", () => {
    console.log("✅ WhatsApp Web conectado.");
    io.emit("ready");
  });

  client.on("authenticated", () => {
    console.log("Autenticado en whatsapp");
    io.emit("authenticated"); // Avisar al frontend que ya esta autenticado
  });

  client.on("auth_failure", (msg) => {
    console.log("Error de autenticación:", msg);
    io.emit("auth_failure", msg);
  });

  // Iniciar cliente de WhatsApp
  client.initialize();
}
const getAllGroups = async () => {
  if (!client) {
    throw new Error("El cliente de WhatsApp no está inicializado");
  }
  const chats = await client.getChats();
  const groups = chats.filter((chat) => chat.id.server == "g.us");
  const groupsNamesId = [];
  groups.forEach((group) => {
    console.log(`Grupo: ${group.name} - ID: ${group.id._serialized}`);
    groupsNamesId.push({
      groupName: group.name,
      groupId: group.id._serialized,
    });
  });
  return groupsNamesId;
};

// Función para enviar mensajes
const sendBirthdayMessages = async (happyCustomers, whatsappNumber) => {
  if (!client) {
    throw new Error("El cliente de WhatsApp no está inicializado");
  }
  const numeroWhatsApp = whatsappNumber;
  // `${persona.phone}@c.us`;
  for (const happyCustomer of happyCustomers) {
    const mensaje = `🎉 Hoy cumple ${happyCustomer.name}! 📅 Teléfono: ${happyCustomer.phone}, Cumpleaños: ${happyCustomer.birthday}`;
    try {
      await client.sendMessage(numeroWhatsApp, mensaje);
      console.log(`📨 Mensaje enviado a ${happyCustomer.name}`);
    } catch (err) {
      console.error(`❌ Error enviando a ${happyCustomer.name}:`, err);
    }
  }
};

// const getGroupByName = async (grupName) => {
//   const chats = await client.getChats();
//   const group = chats.find((chat) => chat.isGroup && chat.name === grupName);

//   if (group) {
//     console.log(`El ID del grupo es: ${group.id._serialized}`);
//   } else {
//     console.log("Grupo no encontrado");
//   }
// };

module.exports = { initWhatsapp, getAllGroups, sendBirthdayMessages };

// module.exports = { client, sendBirthdayMessages, getGroupByName, getAllGroups };
