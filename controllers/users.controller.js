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
            { _id: { $nin: user.friendList.map((friend) => friend.user_id) } },
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

// [GET] /users/requests
module.exports.getRequestFriends = async (req, res) => {
    const user = req.session.user;

    // Socket
    userSocket(req);
    // End Socket

    const requestFriends = await User.find({
        _id: { $in: user.requestFriend },
    })
        .select("-password")
        .lean();

    res.render("pages/request-friends", {
        title: "Lời mời đã gửi",
        user: user,
        requestFriends: requestFriends,
    });
};

// [GET] /users/accepts
module.exports.getAcceptFriends = async (req, res) => {
    const user = req.session.user;

    // Socket
    userSocket(req);
    // End Socket

    const acceptFriends = await User.find({
        _id: { $in: user.acceptFriend },
    })
        .select("-password")
        .lean();

    res.render("pages/accept-friends", {
        title: "Lời mời kết bạn",
        user: user,
        acceptFriends: acceptFriends,
    });
};
