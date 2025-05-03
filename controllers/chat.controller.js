const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const { uploadToCloudinary } = require("../helpers/uploadToCloudinary");
const chatSocket = require("../sockets/chat.socket");

module.exports.index = async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    const user = req.session.user;

    const idRoomChat = req.params.idRoomChat;

    // SocketIO
    chatSocket(req, res);
    // END_SocketIO

    // Lấy data từ database
    const chats = await Chat.find({
        room_chat_id: idRoomChat,
        deleted: false,
    }).lean();

    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id,
        })
            .select("-password")
            .lean();

        chat.infoUser = infoUser;
    }
    // Hết Lấy data từ database

    res.render("pages/chat", {
        user: req.session.user,
        chats: chats,
    });
};
