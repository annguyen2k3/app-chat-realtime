require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const database = require("./config/database");

database.connect();

global._io = io;

const router = require("./routes/index.route");

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

router(app);

server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
