const Client = require("../models/Client");

const createClient = async (clientData) => {
  return await Client.create(clientData);
};

const getAllClients = async () => {
  return await Client.findAll();
};

const getClientById = async (id) => {
  const client = await Client.findByPk(id);
  if (!client) throw new Error("Client not found");
  return client;
};

const updateClient = async (id, updateData) => {
  const client = await Client.findByPk(id);
  if (!client) throw new Error("Client not found");
  return await client.update(updateData);
};

const deleteClient = async (id) => {
  const client = await Client.findByPk(id);
  if (!client) throw new Error("Client not found");
  await client.destroy();
  return { message: "Client deleted successfully" };
};

const getClientsByUser = async (userId) => {
  return await Client.findAll({
    where: { assignedTo: userId },
  });
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  getClientsByUser,
};
