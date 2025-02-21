require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./config/db");

const PORT = process.env.PORT || 5000;

// Sincroniza los modelos y arranca el servidor
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Error al sincronizar la base de datos:", err));
