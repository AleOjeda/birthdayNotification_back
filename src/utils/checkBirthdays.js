const { Customer } = require("../../database/models");

const customerHappyBirhdayList = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    const today = new Date();
    const customerHappyBirhdayList = [];
    for (const customer of customers) {
      // Convertir la fecha de cumpleaños desde string a Date correctamente
      const birthday = new Date(customer.birthday + "T00:00:00");
      // Comparar solo mes y día, ignorando el año (usando horario local)
      if (
        today.getMonth() === birthday.getMonth() &&
        today.getDate() === birthday.getDate()
      ) {
        customerHappyBirhdayList.push(customer);
        console.log(`🎉 Hoy es el cumpleaños de: ${customer.name} 🥳`);
      }
    }
    return customerHappyBirhdayList;
  } catch (error) {
    throw new Error("❌ Error getting the happy birthday customer list");
  }
};
module.exports = { customerHappyBirhdayList };
