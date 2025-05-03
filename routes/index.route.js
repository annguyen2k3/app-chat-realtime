const authRoute = require("./auth.route");
const usersRoute = require("./users.route");
const chatRoute = require("./chat.route");

const authMiddleware = require("../middleware/auth.middleware");

module.exports = (app) => {
    app.get("/", (req, res) => {
        if (req.session.user) {
            res.redirect("/users/friends");
        } else {
            res.redirect("/auth/login");
        }
    });

    app.use("/auth", authRoute);

    app.use("/users", usersRoute);

    app.use("/chat", chatRoute);
};
