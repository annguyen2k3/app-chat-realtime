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

// CLIENT_SEND_MESSAGE
messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();

    if (message) {
        socket.emit("CLIENT_SEND_MESSAGE", message);
        messageInput.value = "";
    }
});
// END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = chatBox.getAttribute("my-id");

    const div = document.createElement("div");

    if (data.user_id === myId) {
        div.className = "d-flex flex-column align-items-end mb-2";
        div.innerHTML = `
            <div class="p-2 bg-pink rounded-pill text-white">${data.content}</div>
        `;
    } else {
        div.className = "d-flex flex-column align-items-start mb-2";
        div.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <img src="${data.avatar}" alt="avatar" width="32" height="32" class="rounded-circle">
                <div class="text-muted small fw-bold">${data.fullname}</div>
            </div>
            <div class="p-2 bg-light rounded-pill text-dark">${data.content}</div>
        `;
    }

    chatBox.querySelector(".messages-container").appendChild(div);
    // Cuộn xuống sau khi thêm tin nhắn mới
    scrollToBottom();
});
// END SERVER_RETURN_MESSAGE

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
    });
}
// End Insert Icon into Input

// End Show Icon Chat
