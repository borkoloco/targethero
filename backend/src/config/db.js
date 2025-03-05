const { Sequelize } = require("sequelize");
require("dotenv").config();

//const pg = require("pg");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Success connecting to db"))
  .catch((err) => console.error("Error connecting to db:", err));

module.exports = sequelize;
