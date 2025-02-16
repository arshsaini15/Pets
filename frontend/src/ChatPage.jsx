import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { socket } from "./utils/socket.js"
import axios from "axios"
import "./ChatPage.css"

const ChatPage = () => {
    const { userId } = useParams()
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [chatUser, setChatUser] = useState(null)
    const token = localStorage.getItem("token")
    const loggedInUserId = localStorage.getItem("userId")
    const messagesEndRef = useRef(null)

    useEffect(() => {
        if (loggedInUserId) {
            socket.emit("registerUser", loggedInUserId)
        }

        return () => {
            socket.off("connect")
            socket.off("disconnect")
        }
    }, [loggedInUserId])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, messagesRes] = await Promise.all([
                    axios.get(`http://localhost:8000/api/v1/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`http://localhost:8000/api/v1/chats/history/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setChatUser(userRes.data);
                setMessages(messagesRes.data || []);
                scrollToBottom();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData()
    }, [userId, token])


    useEffect(() => {
        const handleReceiveMessage = (message) => {
            console.log("📩 New message received:", message);
            setMessages((prev) => [...prev, message]);
            scrollToBottom();
        };
    
        socket.on("receiveMessage", handleReceiveMessage);
    
        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, []);
    
    
    const sendMessage = async () => {
        if (!newMessage.trim()) return;
    
        const tempMessage = {
            _id: Date.now(),
            senderId: loggedInUserId,
            recipientId: userId,
            text: newMessage,
            pending: true,
        };
    
        setMessages((prev) => [...prev, tempMessage]); // ✅ Update UI instantly
        setNewMessage("");
    
        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/chats/send",
                { recipientId: userId, text: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.data) {
                setMessages((prev) =>
                    prev.map((msg) => (msg._id === tempMessage._id ? response.data : msg))
                );
                
                // ✅ Emit to the correct recipient instantly
                socket.emit("sendMessage", { 
                    senderId: loggedInUserId, 
                    receiverId: userId, 
                    text: newMessage 
                });
            }
        } catch (error) {
            console.error("❌ Error sending message:", error);
            setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
        }
    }    

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <div className="chat-page">
            <div className="chat-header">
                {chatUser && (
                    <>
                        <img src={chatUser.profileImage} alt="User" className="profile-photo" />
                        <h2>{chatUser.name}</h2>
                    </>
                )}
            </div>
            <div className="messages">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div 
                            key={msg._id || index} 
                            className={`message ${msg.senderId === loggedInUserId ? "sent" : "received"}`}
                        >
                            <span>{msg.text}</span>
                        </div>
                    ))
                ) : (
                    <p>No messages yet</p>
                )}
                <div ref={messagesEndRef} />
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