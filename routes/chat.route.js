const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat.controller");

router.get("/", chatController.index);

module.exports = router;
