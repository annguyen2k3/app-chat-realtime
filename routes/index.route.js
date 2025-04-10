const chatController = require("../controllers/chat.controller");

module.exports = (app) => {
    app.get("/", chatController.index);

    app.get("/login", (req, res) => {
        res.render("login");
    });
};
