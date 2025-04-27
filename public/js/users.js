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
const refuseFriend = (btn) => {
    btn.addEventListener("click", () => {
        const boxUser = btn.closest(".box-user");

        const user_id = boxUser.getAttribute("user-id");

        boxUser.classList.add("refused");

        socket.emit("CLIENT_REFUSE_REQUEST_FRIEND", {
            user_id: user_id,
        });
    });
};

const btnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (btnRefuseFriend) {
    btnRefuseFriend.forEach((btn) => {
        refuseFriend(btn);
    });
}
// Hết Chức năng từ chối lời mời kết bạn

// Chức năng chấp nhận kết bạn
const acceptFriend = (btn) => {
    btn.addEventListener("click", () => {
        const boxUser = btn.closest(".box-user");

        const user_id = boxUser.getAttribute("user-id");

        boxUser.classList.add("accepted");

        socket.emit("CLIENT_ACCEPT_REQUEST_FRIEND", {
            user_id: user_id,
        });
    });
};

const btnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (btnAcceptFriend) {
    btnAcceptFriend.forEach((btn) => {
        acceptFriend(btn);
    });
}
// Hết chức năng chấp nhận kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeAcceptFriend = document.querySelector("[badge-accept-friend]");
if (badgeAcceptFriend) {
    const userId = badgeAcceptFriend.getAttribute("badge-accept-friend");
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        if (data.user_id === userId) {
            badgeAcceptFriend.innerHTML = data.lengthAcceptFriend;
        }
    });
}
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// Hiển thị lời mời kết bạn realtime
const dataUserAccept = document.querySelector("[data-user-accept]");
if (dataUserAccept) {
    const userId = dataUserAccept.getAttribute("data-user-accept");

    socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
        if (data.user_id === userId) {
            const div = document.createElement("div");
            div.classList.add("col-sm-6");

            div.innerHTML = `
                <div
                    class="box-user d-flex align-items-center gap-3 border border-secondary-subtle rounded-3 p-3"
                    user-id="${data.userRequest._id}"
                >
                    <div class="user-avatar">
                        <img
                            src="${
                                data.userRequest.avatar
                                    ? data.userRequest.avatar
                                    : "/images/circle-user-solid.svg"
                            }"
                            alt="${data.userRequest.fullname}"
                            height="50"
                            width="50"
                            class="rounded-circle"
                        />
                    </div>
                    <div>
                        <div class="user-name">
                            <h6 class="user-name-text mb-0">${
                                data.userRequest.fullname
                            }</h6>
                        </div>
                        <div class="action-user mt-2">
                            <button
                                class="btn btn-success btn-sm text-white"
                                btn-accept-friend
                            >
                                <i class="bi bi-person-add me-1"></i>
                                Chấp nhận
                            </button>
                            <button
                                class="btn btn-success btn-sm text-white"
                                disabled
                                btn-accepted-friend
                            >
                                <i class="bi bi-person-add me-1"></i>
                                Đã kết bạn
                            </button>
                            <button
                                class="btn btn-secondary btn-sm text-white ms-2"
                                btn-refuse-friend
                            >
                                <i class="bi bi-person-x me-1"></i>
                                Từ chối
                            </button>
                            <button
                                class="btn btn-secondary btn-sm text-white"
                                disabled
                                btn-refused-friend
                            >
                                <i class="bi bi-person-x me-1"></i>
                                Đã xoá lời mời
                            </button>
                        </div>
                    </div>
                </div>
            `;

            dataUserAccept.appendChild(div);

            const btnAcceptFriend = div.querySelector("[btn-accept-friend]");
            acceptFriend(btnAcceptFriend);

            const btnRefuseFriend = div.querySelector("[btn-refuse-friend]");
            refuseFriend(btnRefuseFriend);
        }
    });

    socket.on("SERVER_RETURN_CANCEL_REQUEST_FRIEND", (data) => {
        if (data.user_id === userId) {
            const boxUserRemove = document.querySelector(
                `.box-user[user-id="${data.userRequest_id}"]`
            );
            if (boxUserRemove) {
                const colBox = boxUserRemove.closest(".col-sm-6");
                colBox.remove();
            }
        }
    });
}
// End Hiển thị lời mời kết bạn realtime
