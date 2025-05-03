const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const { uploadToCloudinary } = require("../helpers/uploadToCloudinary");

module.exports = (req, res) => {
    const user = req.session.user;

    const idRoomChat = req.params.idRoomChat;

    _io.once("connection", (socket) => {
        socket.join(idRoomChat);

        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            let images = [];

            for (const imageBuffer of data.images) {
                const link = await uploadToCloudinary(imageBuffer);
                images.push(link);
            }

            const chat = new Chat({
                user_id: user._id,
                room_chat_id: idRoomChat,
                content: data.message,
                images: images,
            });
            await chat.save();

            // Trả data về client
            _io.to(idRoomChat).emit("SERVER_RETURN_MESSAGE", {
                user_id: user._id,
                fullname: user.fullname,
                avatar: user.avatar,
                content: data.message,
                images: images,
            });
        });

        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.to(idRoomChat).emit("SERVER_RETURN_TYPING", {
                user_id: user._id,
                fullname: user.fullname,
                avatar: user.avatar,
                type: type,
            });
        });
    });
};
