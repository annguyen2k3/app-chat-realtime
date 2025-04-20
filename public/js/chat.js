import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

const socket = io();
const chatBox = document.querySelector("#chatBox");
const messageInput = document.querySelector("#messageInput");
const messageForm = document.querySelector("#messageForm");

// Hàm cuộn xuống tin nhắn mới nhất
const scrollToBottom = () => {
    chatBox.scrollTop = chatBox.scrollHeight;
};

// Cuộn xuống khi mới load trang
scrollToBottom();

const upload = new FileUploadWithPreview.FileUploadWithPreview(
    "upload-images",
    {
        multiple: true,
        maxFileCount: 5,
    }
);

// CLIENT_SEND_MESSAGE
messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    const images = upload.cachedFileArray;

    if (message || images.length > 0) {
        socket.emit("CLIENT_SEND_MESSAGE", {
            message: message,
            images: images,
        });
        messageInput.value = "";

        // Dừng timeout hiện tại và gửi sự kiện ẩn typing
        clearTimeout(timeout);
        upload.resetPreviewPanel();
        socket.emit("CLIENT_SEND_TYPING", "hide");
    }
});
// END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const boxTyping = chatBox.querySelector(".inner-list-typing");

    const myId = chatBox.getAttribute("my-id");

    const div = document.createElement("div");

    if (data.user_id === myId) {
        div.className = "d-flex flex-column align-items-end mb-2";
        div.innerHTML = `
            ${
                data.content
                    ? `<div class="p-2 bg-pink rounded-pill text-white" style="max-width: 80%; word-wrap: break-word;">${data.content}</div>`
                    : ""
            }
            ${
                data.images
                    ? data.images
                          .map(
                              (image) =>
                                  `<img src="${image}" alt="image" width="200" height="200">`
                          )
                          .join("")
                    : ""
            }
        `;
    } else {
        div.className = "d-flex flex-column align-items-start mb-2";
        div.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <img src="${
                    data.avatar ? data.avatar : "/images/circle-user-solid.svg"
                }" alt="avatar" width="16" height="16" class="rounded-circle">
                <div class="text-muted small fw-bold">${data.fullname}</div>
            </div>
            ${
                data.content
                    ? `<div class="p-2 bg-light rounded-pill text-dark" style="max-width: 80%; word-wrap: break-word;">${data.content}</div>`
                    : ""
            }
            ${
                data.images
                    ? data.images
                          .map(
                              (image) =>
                                  `<img src="${image}" alt="image" width="200" height="200">`
                          )
                          .join("")
                    : ""
            }
        `;
    }

    chatBox.querySelector(".messages-container").insertBefore(div, boxTyping);
    // Cuộn xuống sau khi thêm tin nhắn mới
    scrollToBottom();
});
// END SERVER_RETURN_MESSAGE

// Show Typing
var timeout;
const showTyping = () => {
    const message = messageInput.value.trim();

    if (message) {
        socket.emit("CLIENT_SEND_TYPING", "show");

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            socket.emit("CLIENT_SEND_TYPING", "hide");
        }, 3000);
    } else {
        clearTimeout(timeout);
        socket.emit("CLIENT_SEND_TYPING", "hide");
    }
};

// End Show Typing

// Show Icon Chat
// Show Popup
const btnIcon = document.querySelector(".btn-icon");
if (btnIcon) {
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(btnIcon, tooltip);

    btnIcon.onclick = () => {
        tooltip.classList.toggle("show");
    };

    // Hide tooltip when clicking outside
    document.addEventListener("click", (e) => {
        if (!btnIcon.contains(e.target) && !tooltip.contains(e.target)) {
            tooltip.classList.remove("show");
        }
    });
}
// End Show Popup

// Insert Icon into Input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    emojiPicker.addEventListener("emoji-click", (e) => {
        messageInput.value += e.detail.unicode;

        const end = messageInput.value.length;
        messageInput.setSelectionRange(end, end);
        messageInput.focus();

        showTyping();
    });
}
// End Insert Icon into Input
// End Show Icon Chat

// Typing
messageInput.addEventListener("keyup", () => {
    showTyping();
});
// End Typing

// SERVER_RETURN_TYPING
const listTyping = document.querySelector(".inner-list-typing");
socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
        const checkExist = listTyping.querySelector(
            `.box-typing[user-id="${data.user_id}"]`
        );

        if (!checkExist) {
            const div = document.createElement("div");
            div.className =
                "box-typing d-flex flex-column align-items-start mb-2";

            div.setAttribute("user-id", data.user_id);
            div.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <img class="inner-avatar rounded-circle" src="${data.avatar}" alt="avatar" width="16" height="16">
                <div class="inner-name text-muted small fw-bold">${data.fullname}</div>
            </div>
            <div class="inner-dots">
                <span></span>
                <span></span>
                <span> </span>
            </div>
        `;

            listTyping.appendChild(div);
            scrollToBottom();
        }
    } else {
        const checkExist = listTyping.querySelector(
            `.box-typing[user-id="${data.user_id}"]`
        );
        if (checkExist) {
            listTyping.removeChild(checkExist);
        }
    }
});
// End SERVER_RETURN_TYPING
