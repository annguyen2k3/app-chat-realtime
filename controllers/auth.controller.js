const User = require("../models/users.model");

module.exports.index = async (req, res) => {
    res.render("login");
};

module.exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (!user) {
        res.render("login", {
            messages: {
                error: "Tài khoản hoặc mật khẩu không chính xác",
            },
        });
        return;
    }

    // Lưu thông tin user vào session
    req.session.user = {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
    };

    res.redirect("/");
};
