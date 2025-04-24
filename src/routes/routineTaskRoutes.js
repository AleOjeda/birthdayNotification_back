const express = require("express");
const router = express.Router();
const routineTaskController = require("../controllers/routineTaskController");

router.post(
  "/getCustomerHappyBirhdayList",
  routineTaskController.getCustomerHappyBirhdayList
);
router.post("/checkWhatsappGroups", routineTaskController.checkWhatsappGroups);
router.post(
  "/sendWhatsappWithHappyBirthdays",
  routineTaskController.sendWhatsappWithHappyBirthdays
);
router.get("/limpiarSesion", routineTaskController.limpiarSesion);
// router.get("/:id", customerController.getById);
// router.post("/", customerController.create);
// router.put("/:id", customerController.update);
// router.delete("/:id", customerController.softDelete);

module.exports = router;
