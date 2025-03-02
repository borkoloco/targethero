const express = require("express");
const router = express.Router();
const { getRanking } = require("../controllers/rankingController");

router.get("/", getRanking);

module.exports = router;
