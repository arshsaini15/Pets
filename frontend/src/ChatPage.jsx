import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket } from "./utils/socket.js";
import axios from "axios";
import "./ChatPage.css";

const ChatPage = () => {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatUser, setChatUser] = useState(null);
    const token = localStorage.getItem("token");
    const loggedInUserId = localStorage.getItem("userId");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
    
        if (storedUserId) {
            console.log(`📡 Registering user: ${storedUserId}`);
            socket.emit("registerUser", storedUserId);
        } else {
            console.error("⚠️ No userId found in localStorage!");
        }
    }, []);

    useEffect(() => {
        const handleReceiveMessage = (message) => {
            console.log("📩 New message received:", message);
    
            if (message.senderId === loggedInUserId) return;
    
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        };
    
        socket.on("receiveMessage", handleReceiveMessage);
    
        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [loggedInUserId])
    

    // Fetch chat data
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
                console.error("❌ Error fetching data:", error);
            }
        };

        if (userId) fetchData();
    }, [userId]);

    // Send message function
    const sendMessage = async (messageToSend = null) => {
        const messageText = messageToSend?.text || newMessage;
        if (!messageText.trim()) return;

        const tempMessage = {
            _id: messageToSend?._id || Date.now(), // Use existing ID if retrying
            senderId: loggedInUserId,
            receiverId: userId,
            text: messageText,
            pending: true, // Mark as pending
            error: false, // Track failed messages
        };

        setMessages((prev) => [...prev, tempMessage]);
        if (!messageToSend) setNewMessage(""); // Clear input only on first send

        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/chats/send",
                { recipientId: userId, text: messageText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data) {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === tempMessage._id ? { ...response.data, pending: false, error: false } : msg
                    )
                );

                socket.emit("sendMessage", {
                    senderId: loggedInUserId,
                    receiverId: userId,
                    text: messageText,
                });

                console.log(`📤 Message sent via socket: ${messageText}`);
            }
        } catch (error) {
            console.error("❌ Error sending message:", error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === tempMessage._id ? { ...msg, pending: false, error: true } : msg
                )
            );
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
                            className={`message ${msg.senderId === loggedInUserId ? "sent" : "received"} 
                                ${msg.pending ? "pending" : ""} ${msg.error ? "error" : ""}`}
                            onClick={() => msg.error && sendMessage(msg)} // Retry on click
                        >
                            <span>{msg.text}</span>
                            {msg.error && <small>❌ Failed. Tap to retry.</small>}
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
                <button onClick={() => sendMessage()}>Send</button>
            </div>
        </div>
    )
}

export default ChatPage