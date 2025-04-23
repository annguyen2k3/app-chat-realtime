const User = require("../models/user.model");

const userSocket = require("../sockets/users.socket");

// [GET] /users/friends
module.exports.getFriends = async (req, res) => {
    // Kiểm tra đăng nhập
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    res.render("pages/friends", {
        title: "Danh sách bạn bè",
        user: req.session.user,
    });
};

// [GET] /users/not-friends
module.exports.getNotFriends = async (req, res) => {
    // Socket
    userSocket(req);
    // End Socket

    const user = req.session.user;

    const notFriends = await User.find({
        $and: [
            { _id: { $ne: user._id } },
            { _id: { $nin: user.acceptFriend } },
            { _id: { $nin: user.requestFriend } },
        ],
        status: "active",
        deleted: false,
    })
        .select("-password")
        .lean();

    res.render("pages/not-friends", {
        title: "Danh sách người dùng",
        user: req.session.user,
        notFriends: notFriends,
    });
};
