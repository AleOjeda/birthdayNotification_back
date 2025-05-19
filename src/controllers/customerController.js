const { Customer } = require("../../database/models");

const getAll = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      where: {
        userId: req.user.userId,
      },
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: "No encontrado" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);
    newCustomer.userId = req.user.userId;
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        id: userId,
        userId: req.user.userId,
      },
    });

    // findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: "No encontrado" });

    await customer.update(req.body);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const softDelete = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: "No encontrado" });

    await customer.destroy();
    res.json({ message: "Eliminado correctamente (soft delete)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  softDelete,
};
