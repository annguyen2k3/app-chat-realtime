const socket = io();

// Chức năng gửi lời mời kết bạn
const btnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (btnAddFriend) {
    btnAddFriend.forEach((btn) => {
        btn.addEventListener("click", () => {
            const boxUser = btn.closest(".box-user");

            const user_id = boxUser.getAttribute("user-id");

            boxUser.classList.add("add");

            socket.emit("CLIENT_SEND_REQUEST_FRIEND", {
                user_id: user_id,
            });
        });
    });
}
// Hết Chức năng gửi lời mời kết bạn

// Chức năng huỷ lời mời kết bạn
const btnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (btnCancelFriend) {
    btnCancelFriend.forEach((btn) => {
        btn.addEventListener("click", () => {
            const boxUser = btn.closest(".box-user");

            const user_id = boxUser.getAttribute("user-id");

            boxUser.classList.remove("add");

            socket.emit("CLIENT_CANCEL_REQUEST_FRIEND", {
                user_id: user_id,
            });
        });
    });
}
// Hết Chức năng huỷ lời mời kết bạn

// Chức năng từ chối lời mời kết bạn
const btnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (btnRefuseFriend) {
    btnRefuseFriend.forEach((btn) => {
        btn.addEventListener("click", () => {
            const boxUser = btn.closest(".box-user");

            const user_id = boxUser.getAttribute("user-id");

            boxUser.classList.add("refused");

            socket.emit("CLIENT_REFUSE_REQUEST_FRIEND", {
                user_id: user_id,
            });
        });
    });
}
// Hết Chức năng từ chối lời mời kết bạn

// Chức năng chấp nhận kết bạn
const btnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (btnAcceptFriend) {
    btnAcceptFriend.forEach((btn) => {
        btn.addEventListener("click", () => {
            const boxUser = btn.closest(".box-user");

            const user_id = boxUser.getAttribute("user-id");

            boxUser.classList.add("accepted");

            socket.emit("CLIENT_ACCEPT_REQUEST_FRIEND", {
                user_id: user_id,
            });
        });
    });
}
// Hết chức năng chấp nhận kết bạn

// SERVER_RETURN_ACCEPT_FRIEND
const badgeAcceptFriend = document.querySelector("[badge-accept-friend]");
if (badgeAcceptFriend) {
    const userId = badgeAcceptFriend.getAttribute("badge-accept-friend");
    socket.on("SERVER_RETURN_ACCEPT_FRIEND", (data) => {
        if (data.user_id === userId) {
            badgeAcceptFriend.innerHTML = data.lengthAcceptFriend;
        }
    });
}
// End SERVER_RETURN_ACCEPT_FRIEND
