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
