const { getAllGroups } = require("../services/whatsappService");
const { customerHappyBirhdayList } = require("../utils/checkBirthdays");
const { sendBirthdayMessages } = require("../services/whatsappService");
const fs = require("fs");
const path = require("path");

const getCustomerHappyBirhdayList = async (req, res) => {
  try {
    const data = await customerHappyBirhdayList();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkWhatsappGroups = async (req, res) => {
  const data = await getAllGroups();
  res.status(200).json(data);
};

const sendWhatsappWithHappyBirthdays = async (req, res) => {
  // cron.schedule("* * * * *", async () => {
  //   console.log("⏰ Ejecutando la tarea automática diaria...");
  try {
    const happyCustomers = await customerHappyBirhdayList();
    // const whatsappNumber = `56941794838@c.us`; //Alejandro
    // const whatsappNumber = "120363389712368421@g.us"; // Grupo birthday
    const whatsappNumber = "120363401804528184@g.us"; // Grupo birthday
    await sendBirthdayMessages(happyCustomers, whatsappNumber);
    console.log("🎉 Tarea diaria ejecutada correctamente.");
    res.status(200).json("Enviado mensaje de cumpleaños");
  } catch (error) {
    console.log("🎉 Tarea diaria ejecutada con errores.", error.message);
    res.status(500).json("error");
  }
};

const limpiarSesion = (req, res) => {
  const authPath = path.join(__dirname, "..", "..", ".wwebjs_auth");
  const cachePath = path.join(__dirname, "..", "..", ".wwebjs_cache");
  const deleteFlagPath = path.join(__dirname, "..", "..", ".delete-session");

  try {
    if (fs.existsSync(authPath)) {
      fs.rmSync(authPath, { recursive: true, force: true });
      console.log("🧹 Carpeta .wwebjs_auth eliminada");
    }

    if (fs.existsSync(cachePath)) {
      fs.rmSync(cachePath, { recursive: true, force: true });
      console.log("🧼 Cache de sesión eliminada");
    }

    fs.writeFileSync(deleteFlagPath, "delete session");
    console.log("🪧 Bandera de reinicio de sesión creada");

    res.status(200).json({
      success: true,
      message: "Sesión borrada. Reinicio en próximo arranque.",
    });
  } catch (err) {
    console.error("❌ Error al intentar borrar sesión:", err);
    res.status(500).json({
      success: false,
      message: "Error al borrar sesión",
      error: err.message,
    });
  }
};

module.exports = {
  checkWhatsappGroups,
  getCustomerHappyBirhdayList,
  sendWhatsappWithHappyBirthdays,
  sendWhatsappWithHappyBirthdays,
  limpiarSesion,
};
