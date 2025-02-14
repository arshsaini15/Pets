import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { socket } from "./utils/socket.js"
import axios from "axios"
import "./ChatPage.css"

const ChatPage = () => {
    const { userId } = useParams()
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const token = localStorage.getItem('token')

    useEffect(() => {
        axios.get(`http://localhost:8000/api/v1/chats/history/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
            setMessages(response.data || [])
        })
        .catch((error) => console.error("Error fetching messages:", error))
    }, [userId])

    useEffect(() => {
        socket.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message])
        })
        return () => socket.off("receiveMessage")
    }, [])

    const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempMessage = {
        _id: Date.now(),
        sender: { _id: userId },
        text: newMessage,
        pending: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
        const response = await axios.post("http://localhost:8000/api/v1/chats/send", { recipientId: userId, text: newMessage }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
            setMessages((prev) =>
                prev.map((msg) => (msg._id === tempMessage._id ? response.data : msg)) // ✅ Replace temp message with real one
            );
            socket.emit("sendMessage", response.data);
        }
    } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id)); // ❌ Remove failed message
    }
};

    return (
        <div className="chat-page">
            <h2>Chat</h2>
            <div className="messages">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender?._id === userId ? "received" : "sent"}`}>
                            {msg.text}
                        </div>
                    ))
                ) : (
                    <p>No messages yet</p>
                )}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={ sendMessage }>Send</button>
            </div>
        </div>
    )
}

export default ChatPage