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

router.get(
    "/requests",
    authMiddleware.requireAuth,
    usersController.getRequestFriends
);

router.get(
    "/accepts",
    authMiddleware.requireAuth,
    usersController.getAcceptFriends
);

module.exports = router;
