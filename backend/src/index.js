import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from './app.js'
import { createServer } from "http"
import { Server } from "socket.io"

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    const server = createServer(app)

    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:5174'],
            credentials: true
        }
    })

    io.on('connection', (socket) => {
        console.log(`🔥 User connected: ${socket.id}`)

        socket.on("sendMessage", (data) => {
            console.log("Message received:", data)
            io.emit("receiveMessage", data)
        })

        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`)
        })
    })

    const port = process.env.PORT
    server.listen(port, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`)
    })
})

.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})