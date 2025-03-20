const clientService = require("../services/clientService");

const createClient = async (req, res) => {
  try {
    const newClient = await clientService.createClient(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllClients = async (req, res) => {
  try {
    if (req.query.assignedTo) {
      const clients = await clientService.getClientsByUser(
        req.query.assignedTo
      );
      res.json(clients);
    } else {
      const clients = await clientService.getAllClients();
      res.json(clients);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.id);
    res.json(client);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body);
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const result = await clientService.deleteClient(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getClientsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const clients = await clientService.getClientsByUser(userId);
    res.json(clients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  getClientsByUser,
};
