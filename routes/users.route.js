const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/friends", authMiddleware.requireAuth, usersController.getFriends);

router.get(
    "/not-friends",
    authMiddleware.requireAuth,
    usersController.getNotFriends
);

module.exports = router;
