const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async ({ username, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword });
  return user;
};

const loginUser = async ({ username, password }) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new Error("Usuario no encontrado");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Credenciales inválidas");

  // Se firma el token usando una clave secreta (almacénala en variables de entorno)
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
};

module.exports = { loginUser, registerUser };
