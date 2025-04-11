const chatController = require("../controllers/chat.controller");
const authController = require("../controllers/auth.controller");

module.exports = (app) => {
    app.get("/", chatController.index);

    app.get("/login", authController.index);

    app.post("/login", authController.login);
};
