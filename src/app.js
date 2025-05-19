const cookieParser = require("cookie-parser");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const customerRoutes = require("./routes/customerRoutes");
const userRoutes = require("./routes/userRoutes");
const routineTaskRoutes = require("./routes/routineTaskRoutes");
// const routineTaskController = require("./controllers/routineTaskController");
// const { sendBirthdayMessages, client } = require("./services/whatsappService");
const app = express();

// en server.js antes de routes:
app.use(cookieParser());
// Configurar una tarea cron para ejecutarse todos los días a la medianoche
// * * * * *
// │ │ │ │ │
// │ │ │ │ └── (Opcional) Día de la semana (0 - 7) (Domingo = 0 o 7)
// │ │ │ └──── Mes (1 - 12)
// │ │ └────── Día del mes (1 - 31)
// │ └──────── Hora (0 - 23)
// └────────── Minuto (0 - 59)
cron.schedule("00 10 * * *", async () => {
  console.log("⏰ Ejecutando la tarea automática diaria...");
  try {
    const resp = await fetch(
      "https://servidorossa.ddns.net/api/routineTask/sendWhatsappWithHappyBirthdays",
      { method: "POST" }
    );
    const data = await resp.json();
    console.log(data);
    //     const happyCustomers = await routineTaskController.checkBirthdays();
    //     // const whatsappNumber = `56941794838@c.us`; //Alejandro
    //     const whatsappNumber = "120363389712368421@g.us";
    //     await sendBirthdayMessages(happyCustomers, whatsappNumber);
    //     console.log("🎉 Tarea diaria ejecutada correctamente.");
  } catch (error) {
    console.log("🎉 Tarea diaria ejecutada con errores.", error.message);
  }
});

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // Acepta cualquiera:
      callback(null, true);
    },
    //origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para recibir x-www-form-urlencoded
app.use("/api/customers", customerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/routineTask", routineTaskRoutes);

module.exports = app;
