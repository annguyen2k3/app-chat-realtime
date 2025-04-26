const User = require("../models/user.model");

module.exports = (req) => {
    _io.once("connection", (socket) => {
        // client gửi lời mời kết bạn
        socket.on("CLIENT_SEND_REQUEST_FRIEND", async (data) => {
            const id_userRequest = req.session.user._id.toString();
            const id_userObject = data.user_id;

            // check danh sách lời mời đã gửi của người gửi
            const check_requestFriend_userRequest = await User.findOne({
                _id: id_userRequest,
                requestFriend: id_userObject,
            });

            if (!check_requestFriend_userRequest) {
                await User.updateOne(
                    {
                        _id: id_userRequest,
                    },
                    {
                        $push: {
                            requestFriend: id_userObject,
                        },
                    }
                );
            }
            // End check danh sách lời mời đã gửi của người gửi

            // check danh sách lời mời đã nhận của người nhận
            const check_acceptFriend_userObject = await User.findOne({
                _id: id_userObject,
                acceptFriend: id_userRequest,
            });

            if (!check_acceptFriend_userObject) {
                await User.updateOne(
                    {
                        _id: id_userObject,
                    },
                    {
                        $push: {
                            acceptFriend: id_userRequest,
                        },
                    }
                );
            }
            // end check danh sách lời mời đã nhận của người nhận

            const userObject = await User.findOne({
                _id: id_userObject,
            });

            const lengthAcceptFriend = userObject.acceptFriend.length;

            socket.broadcast.emit("SERVER_RETURN_ACCEPT_FRIEND", {
                user_id: id_userObject,
                lengthAcceptFriend: lengthAcceptFriend,
            });
        });
        // end client gửi lời mời kết bạn

        // client huỷ lời mời kết bạn
        socket.on("CLIENT_CANCEL_REQUEST_FRIEND", async (data) => {
            const id_userRequest = req.session.user._id.toString();
            const id_userObject = data.user_id;

            await User.updateOne(
                { _id: id_userRequest },
                {
                    $pull: {
                        requestFriend: id_userObject,
                    },
                }
            );

            await User.updateOne(
                { _id: id_userObject },
                {
                    $pull: {
                        acceptFriend: id_userRequest,
                    },
                }
            );
        });
        // end client huỷ lời mời kết bạn

        // Client từ chối lời mời kết bạn
        socket.on("CLIENT_REFUSE_REQUEST_FRIEND", async (data) => {
            const id_userRequest = req.session.user._id.toString();
            const id_userObject = data.user_id;

            await User.updateOne(
                { _id: id_userRequest },
                {
                    $pull: {
                        acceptFriend: id_userObject,
                    },
                }
            );

            await User.updateOne(
                { _id: id_userObject },
                {
                    $pull: {
                        requestFriend: id_userRequest,
                    },
                }
            );
        });
        // Hết Client từ chối lời mời kết bạn

        // Client chấp nhận lời mời kết bạn
        socket.on("CLIENT_ACCEPT_REQUEST_FRIEND", async (data) => {
            const id_userRequest = req.session.user._id.toString();
            const id_userObject = data.user_id;

            await User.updateOne(
                {
                    _id: id_userRequest,
                },
                {
                    $pull: {
                        acceptFriend: id_userObject,
                    },
                    $push: {
                        friendList: {
                            user_id: id_userObject,
                        },
                    },
                }
            );

            await User.updateOne(
                {
                    _id: id_userObject,
                },
                {
                    $pull: {
                        requestFriend: id_userRequest,
                    },
                    $push: {
                        friendList: {
                            user_id: id_userRequest,
                        },
                    },
                }
            );
        });
        // Hết Client chấp nhận lời mời kết bạn
    });
};
