const User = require("../models/user.model");
const RoomChat = require("../models/room-chat.model");

module.exports.isAccess = async (req, res, next) => {
    const user = req.session.user;
    const idRoomChat = req.params.idRoomChat;

    const existUserInRoomChat = await RoomChat.findOne({
        _id: idRoomChat,
        "users.user_id": user._id.toString(),
        deleted: false,
    });

    if (!existUserInRoomChat) {
        res.send("Bạn không có quyền truy cập vào phòng chat này!");
        return;
    } else {
        next();
    }
};
