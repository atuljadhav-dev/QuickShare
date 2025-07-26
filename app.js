const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    maxHttpBufferSize: 1e8,
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    socket.on("joinchat", (data) => {
        socket.join(data);
    });
    socket.on("chatmessage", function (data) {
        io.to(data.rm).emit("newmsg", data.ip);
    });
    socket.on("sendFile", (data, callback) => {
        io.to(data.rm).emit("newfile", data.file);
    });
});

server.listen(3000, () => {
    console.log("listening on :3000");
});
