const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const chatMiddleware = require("../middleware/chat.middleware");

const chatController = require("../controllers/chat.controller");

router.get(
    "/:idRoomChat",
    authMiddleware.requireAuth,
    chatMiddleware.isAccess,
    chatController.index
);

module.exports = router;
