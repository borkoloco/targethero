const { Sequelize } = require("sequelize");
require("dotenv").config();
const pg = require("pg");

const isProduction = process.env.IS_PRODUCTION === "true";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
    dialectmodule: pg,
    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Success connecting to db"))
  .catch((err) => console.error("Error connecting to db:", err));

module.exports = sequelize;
