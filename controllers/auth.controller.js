const User = require("../models/user.model");

module.exports.index = async (req, res) => {
    res.render("login");
};

module.exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({
        username,
        password,
    }).select("-password");

    if (!user) {
        res.render("login", {
            messages: {
                error: "Tài khoản hoặc mật khẩu không chính xác",
            },
        });
        return;
    }

    // Lưu thông tin user vào session
    req.session.user = user;

    res.redirect("/");
};

module.exports.logout = async (req, res) => {
    req.session.destroy();
    res.redirect("/login");
};
