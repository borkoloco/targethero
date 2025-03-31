const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const routes = require("./routes");
const fs = require("fs");
const path = require("path");

const app = express();

const corsOptions = {
  origin: process.env.FRONT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", routes);

require("./config/associations");

sequelize
  .sync({ alter: true, force: false })
  .then(() => console.log("Models synchronized with db"))
  .catch((err) => console.error("Error synchronizing models:", err));

module.exports = app;
