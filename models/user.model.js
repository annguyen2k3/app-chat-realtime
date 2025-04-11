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
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
