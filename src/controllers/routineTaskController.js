const { getAllGroups } = require("../services/whatsappService");
const { customerHappyBirhdayList } = require("../utils/checkBirthdays");
const { sendBirthdayMessages } = require("../services/whatsappService");
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
    const whatsappNumber = "120363389712368421@g.us"; // Grupo birthday
    await sendBirthdayMessages(happyCustomers, whatsappNumber);
    console.log("🎉 Tarea diaria ejecutada correctamente.");
    res.status(200).json("enviado");
  } catch (error) {
    console.log("🎉 Tarea diaria ejecutada con errores.", error.message);
    res.status(500).json("error");
  }
};
module.exports = {
  checkWhatsappGroups,
  getCustomerHappyBirhdayList,
  sendWhatsappWithHappyBirthdays,
};
