import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config({
    path: "./.env",
});

connectDB()
    .then(() => {
        const server = createServer(app);
        const io = new Server(server, {
            cors: {
                origin: ["http://localhost:5173", "http://localhost:5174"],
                credentials: true,
            },
        });

        const users = new Map();

        io.on("connection", (socket) => {
            console.log(`🔥 User connected: ${socket.id}`);

            socket.on("registerUser", (userId) => {
                users.set(userId, socket.id);
                console.log(`✅ User ${userId} registered with socket ${socket.id}`);
                console.log('users: ', users)
            });

            // Handling message sending
            socket.on("sendMessage", ({ senderId, receiverId, text }) => {
                console.log(`📩 Message from ${senderId} to ${receiverId}: ${text}`);

                const receiverSocketId = users.get(receiverId)
                console.log('senderSocketId', users.get(senderId))
                console.log("receiverSocketId", receiverSocketId)
                
                io.to(receiverSocketId).emit("receiveMessage", { senderId, text })
            })

            // Handling user disconnection
            socket.on("disconnect", () => {
                users.forEach((socketId, userId) => {
                    if (socketId === socket.id) {
                        users.delete(userId);
                        console.log(`❌ User ${userId} disconnected`);
                    }
                });
            });

            socket.on("joinGroup", (groupId) => {
                socket.join(groupId);
            });

            socket.on("leaveGroup", (groupId) => {
                socket.leave(groupId);
            });

            socket.on("sendGroupMessage", (message) => {
                io.to(message.groupId).emit("newGroupMessage", message);
            });
        });

        const port = process.env.PORT;
        server.listen(port, () => {
            console.log(`⚙️ Server is running at port : ${port}`);
        });
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !!! ", err);
    });
