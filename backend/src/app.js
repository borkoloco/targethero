const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const routes = require("./routes");

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

app.use("/api", routes);

sequelize
  .sync({ alter: true, force: false })
  .then(() => console.log("Models synchronized with db"))
  .catch((err) => console.error("Error synchronizing models:", err));

module.exports = app;
