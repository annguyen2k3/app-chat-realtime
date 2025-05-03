const mongoose = require("mongoose");

const roomChatSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        avatar: {
            type: String,
        },
        typeRoom: {
            type: String,
            enum: ["private", "group"], // Loại phòng: private hoặc group
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"], // Trạng thái phòng
            default: "active",
        },
        users: [
            {
                user_id: {
                    type: String,
                    required: true,
                },
                role: {
                    type: String,
                    enum: ["superAdmin", "admin", "member"], // Vai trò trong phòng
                    default: "member",
                },
            },
        ],
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);

const RoomChat = mongoose.model("RoomChat", roomChatSchema, "rooms-chat");

module.exports = RoomChat;
