const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const { uploadToCloudinary } = require("../helpers/uploadToCloudinary");

module.exports.index = async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    const user = req.session.user;

    // SocketIO
    _io.once("connection", (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            let images = [];

            for (const imageBuffer of data.images) {
                const link = await uploadToCloudinary(imageBuffer);
                images.push(link);
            }

            const chat = new Chat({
                user_id: user._id,
                content: data.message,
                images: images,
            });
            await chat.save();

            // Trả data về client
            _io.emit("SERVER_RETURN_MESSAGE", {
                user_id: user._id,
                fullname: user.fullname,
                avatar: user.avatar,
                content: data.message,
                images: images,
            });
        });

        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                user_id: user._id,
                fullname: user.fullname,
                avatar: user.avatar,
                type: type,
            });
        });
    });
    // END_SocketIO

    // Lấy data từ database
    const chats = await Chat.find({
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

    res.render("index", {
        user: req.session.user,
        chats: chats,
    });
};
