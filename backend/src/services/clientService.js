const Client = require("../models/Client");

const createClient = async (clientData) => {
  return await Client.create({
    name: clientData.name,
    contactEmail: clientData.contactEmail,
    contactPhone: clientData.contactPhone,
    notes: clientData.notes,
    assignedTo: clientData.assignedTo,
    status: "pending",
    requestedStatus: clientData.status,
  });
};

const getAllClients = async () => {
  return await Client.findAll({ include: ["manager"] });
};

const getClientById = async (id) => {
  const client = await Client.findByPk(id);
  if (!client) throw new Error("Client not found");
  return client;
};

const updateClient = async (id, updateData, userRole = "user") => {
  const client = await Client.findByPk(id);
  if (!client) throw new Error("Client not found");

  if (userRole === "admin") {
    if (
      updateData.status &&
      updateData.status !== client.status &&
      updateData.status === client.requestedStatus
    ) {
      updateData.requestedStatus = null;
    }
    return await client.update(updateData);
  } else {
    const fieldsToUpdate = {
      name: updateData.name,
      contactEmail: updateData.contactEmail,
      contactPhone: updateData.contactPhone,
      notes: updateData.notes,
    };

    if (
      updateData.status &&
      updateData.status !== client.status &&
      updateData.status !== client.requestedStatus
    ) {
      fieldsToUpdate.requestedStatus = updateData.status;
      fieldsToUpdate.status = "pending";
    }

    return await client.update(fieldsToUpdate);
  }
};

const deleteClient = async (id) => {
  const client = await Client.findByPk(id);
  if (!client) throw new Error("Client not found");
  await client.destroy();
  return { message: "Client deleted successfully" };
};

const getClientsByUser = async (userId) => {
  return await Client.findAll({ where: { assignedTo: userId } });
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  getClientsByUser,
};
