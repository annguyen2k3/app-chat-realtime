const socket = io();

// Chức năng kết bạn
const btnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (btnAddFriend) {
    btnAddFriend.forEach((btn) => {
        btn.addEventListener("click", () => {
            const boxUser = btn.closest(".box-user");

            const user_id = boxUser.getAttribute("user-id");

            boxUser.classList.add("add");

            socket.emit("CLIENT_ADD_FRIEND", {
                user_id: user_id,
            });
        });
    });
}
// Hết Chức năng kết bạn
