module.exports.index = (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    _io.on("connection", (socket) => {
        console.log("a user connected:", socket.id);
    });

    res.render("index", { user: req.session.user });
};
