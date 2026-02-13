const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_ROOM_LENGTH = 64;
const MAX_MESSAGE_LENGTH = 2000;
const ROOM_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

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
        if (typeof room !== "string") return;
        const roomName = room.trim();
        if (!roomName || roomName.length > MAX_ROOM_LENGTH) return;
        if (!ROOM_PATTERN.test(roomName)) return;
        socket.join(roomName);
    });

    socket.on("chatmessage", (payload) => {
        if (!payload || typeof payload !== "object") return;
        const rm = typeof payload.rm === "string" ? payload.rm.trim() : "";
        const ip = typeof payload.ip === "string" ? payload.ip.trim() : "";
        if (!rm || !ip) return;
        if (rm.length > MAX_ROOM_LENGTH || !ROOM_PATTERN.test(rm)) return;
        if (ip.length > MAX_MESSAGE_LENGTH) return;

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
        try {
            if (!data || typeof data !== "object") {
                return callback?.({ status: "error", message: "Invalid payload" });
            }

            const rm = typeof data.rm === "string" ? data.rm.trim() : "";
            if (!rm || rm.length > MAX_ROOM_LENGTH || !ROOM_PATTERN.test(rm)) {
                return callback?.({ status: "error", message: "Invalid room" });
            }

            if (!data.file || typeof data.file !== "object") {
                return callback?.({ status: "error", message: "Invalid file data" });
            }

            const name =
                typeof data.file.name === "string"
                    ? data.file.name.trim().slice(0, 255)
                    : "file";
            const type =
                typeof data.file.type === "string"
                    ? data.file.type.slice(0, 100)
                    : "application/octet-stream";

            if (!data.file.data) {
                return callback?.({ status: "error", message: "Missing file content" });
            }

            let buffer;
            try {
                buffer = Buffer.from(data.file.data);
            } catch (error) {
                return callback?.({ status: "error", message: "Invalid file content" });
            }

            if (buffer.length > MAX_FILE_SIZE) {
                return callback?.({ status: "error", message: "File exceeds 50MB" });
            }

            io.to(rm).emit("newfile", {
                file: {
                    name,
                    type,
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
        } catch (error) {
            callback?.({ status: "error", message: "Upload failed" });
        }
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
