const RoomChat = require("../models/room-chat.model");
const User = require("../models/user.model");

const userSocket = require("../sockets/users.socket");

// [GET] /users/friends
module.exports.getFriends = async (req, res) => {
    // Kiểm tra đăng nhập
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    const user = req.session.user;

    const friendsId = user.friendList.map((friend) => friend.user_id);

    const friends = await User.find({
        _id: { $in: friendsId },
    })
        .select("-password")
        .lean();

    for (const friend of friends) {
        const roomChat = await RoomChat.findOne({
            "users.user_id": {
                $all: [user._id.toString(), friend._id.toString()],
            },
        });

        friend.roomChat_id = roomChat._id.toString();
    }

    res.render("pages/friends", {
        title: "Danh sách bạn bè",
        user: user,
        friends: friends,
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
