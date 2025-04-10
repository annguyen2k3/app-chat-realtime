const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const router = require("./routes/index.route");

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

router(app);

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
});

// Change from app.listen to http.listen
http.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
