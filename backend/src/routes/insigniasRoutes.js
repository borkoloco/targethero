const express = require("express");
const router = express.Router();
const insigniaController = require("../controllers/insigniaController");


router.post("/", insigniaController.createInsignia);
router.put("/",insigniaController.updateInsignia);
router.delete("/:id", insigniaController.deleteInsignia);
router.get("/", insigniaController.getAllInsignia);


module.exports = router;
