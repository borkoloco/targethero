const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const { protect } = require("../middleware/authMiddleware");

router.get("/my", protect, clientController.getClientsByUser);
router.get("/", protect, clientController.getAllClients);
router.put("/:id/declined", protect, clientController.declineClient);
router.put("/:id/approved", protect,clientController.approveClient);
router.get("/approved", protect, clientController.getClientApproved);
router.get("/pending", protect, clientController.getClientPending);
router.get("/:id", protect, clientController.getClientById);
router.post("/", protect, clientController.createClient);
router.put("/:id", protect, clientController.updateClient);
router.delete("/:id", protect, clientController.deleteClient);




module.exports = router;
