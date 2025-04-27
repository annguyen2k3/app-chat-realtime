const User = require("../models/user.model");

module.exports.index = async (req, res) => {
    res.render("pages/login");
};

module.exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({
        username,
        password,
    });

    if (!user) {
        res.render("login", {
            messages: {
                error: "Tài khoản hoặc mật khẩu không chính xác",
            },
        });
        return;
    }

    // Lưu thông tin user vào session
    req.session.user = user.toObject(); // Chuyển document Mongoose thành plain object để lưu vào session

    await User.updateOne({ _id: user._id }, { statusOnline: "online" });

    _io.once("connection", (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
            userId: user._id.toString(),
            statusOnline: "online",
        });
    });

    res.redirect("/users/friends");
};

module.exports.logout = async (req, res) => {
    const user = await User.findById(req.session.user._id);

    if (user) {
        user.statusOnline = "offline";
        await user.save();

        // Phát tín hiệu offline ngay lập tức
        _io.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
            userId: user._id.toString(),
            statusOnline: "offline",
        });
    }

    req.session.destroy();

    res.redirect("/auth/login");
};
