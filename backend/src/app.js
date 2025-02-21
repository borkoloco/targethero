const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de autenticación (puedes agregar más rutas a medida que avanzas)
app.use("/api/auth", authRoutes);

module.exports = app;
