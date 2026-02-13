const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const io = new Server(server, {
    maxHttpBufferSize: MAX_FILE_SIZE,
});

const publicPath = path.join(__dirname, "./public");

app.use(express.static(publicPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

io.on("connection", (socket) => {
    socket.on("joinchat", (room) => {
        if (room) socket.join(room);
    });

    socket.on("chatmessage", ({ rm, ip }) => {
        if (!rm || !ip) return;

        io.to(rm).emit("newmsg", {
            text: ip,
            sender: socket.id,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        });
    });

    socket.on("sendFile", (data, callback) => {
        if (!data?.rm || !data?.file?.data) return;

        const buffer = Buffer.from(data.file.data);

        if (buffer.length > MAX_FILE_SIZE) {
            return callback?.({ status: "error" });
        }

        io.to(data.rm).emit("newfile", {
            file: {
                name: data.file.name,
                type: data.file.type,
                data: buffer,
                size: buffer.length,
            },
            sender: socket.id,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        });

        callback?.({ status: "ok" });
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
