require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const database = require("./config/database");
const session = require("express-session");
const router = require("./routes/index.route");

database.connect();

global._io = io;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(
    session({
        secret: "KKHFDKFHDK34",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
    })
);

router(app);

server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
