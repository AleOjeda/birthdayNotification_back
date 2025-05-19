const { User } = require("../../database/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  let users;
  try {
    users = await User.findAll();
    // res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(402).json({ error: "Credenciales inválidas" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(402).json({ error: "Credenciales inválidas" });
  }

  // Generar JWT
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  console.log(token);
  console.log("EXPIRES IN:", process.env.JWT_EXPIRES_IN);
  // Devolver token en JSON
  return res.json({ token });
};

const register = async (req, res) => {
  let users;
  try {
    users = await User.findAll();
    // res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  const { name, username, password } = req.body;
  // Validaciones básicas
  if (typeof username !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ error: "Username y password deben ser strings" });
  }
  // Comprueba si ya existe
  const exists = users.some((u) => u.userName === username);
  if (exists) {
    return res.status(409).json({ error: "Usuario ya registrado" });
  }
  // Hashea la contraseña
  const passwordHash = await bcrypt.hash(password, 10);
  console.log(passwordHash);
  // Crea y guarda el nuevo usuario
  const newUser = {
    name,
    username,
    password: passwordHash,
  };
  try {
    const createdUser = await User.create(newUser);
    delete createdUser.password;

    // (Opcional) Genera un JWT y lo devuelve inmediatamente
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// (Opcional) Ruta para verificar token
// app.get("/auth/me", (req, res) => {
//   const auth = req.headers.authorization;
//   if (!auth?.startsWith("Bearer ")) {
//     return res.status(401).end();
//   }
//   const token = auth.split(" ")[1];
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     return res.json({ user: payload });
//   } catch {
//     return res.status(401).end();
//   }
// });

const getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "No encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const newCustomer = await User.create(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "No encontrado" });

    await user.update(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const softDelete = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "No encontrado" });

    await user.destroy();
    res.json({ message: "Eliminado correctamente (soft delete)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  register,
};
