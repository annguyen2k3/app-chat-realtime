const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            default: "active",
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        requestFriend: {
            type: Array,
            default: [],
        },
        acceptFriend: {
            type: Array,
            default: [],
        },
        friendList: {
            type: [
                {
                    user_id: String,
                    room_chat_id: String,
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
