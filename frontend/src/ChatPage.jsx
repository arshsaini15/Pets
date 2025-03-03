import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "./utils/socket.js";
import axios from "axios";
import "./ChatPage.css";

const ChatPage = () => {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatUser, setChatUser] = useState(null);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const token = localStorage.getItem("token");
    const loggedInUserId = localStorage.getItem("userId");
    const messagesEndRef = useRef(null);
    const navigate = useNavigate()

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            socket.emit("registerUser", storedUserId);
        }
    }, []);

    useEffect(() => {
        socket.on("receiveMessage", (message) => {
            if ((message.sender?._id || message.senderId) === loggedInUserId) return;
            setMessages((prev) => [...prev, message]);
            scrollToBottom();
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [loggedInUserId]);

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
                ])

                setChatUser(userRes.data)
                console.log(userRes.data)
                
                setMessages(messagesRes.data || []);
                scrollToBottom();
            } catch (error) {
                console.error("❌ Error fetching data:", error);
            }
        };

        if (userId) fetchData();
    }, [userId]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const fileUrl = URL.createObjectURL(selectedFile);
            setFilePreview(fileUrl);
        }
    };

    useEffect(() => {
        socket.on("messageSent", (message) => {
            if ((message.sender?._id || message.senderId) !== loggedInUserId) return;
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === message.tempId
                        ? { ...message, pending: false, error: false }
                        : msg
                )
            );
            scrollToBottom();
        });

        return () => {
            socket.off("messageSent");
        };
    }, [loggedInUserId]);

    const sendMessage = async () => {
        if (!newMessage.trim() && !file) return;

        const formData = new FormData();
        formData.append("recipientId", userId);
        formData.append("text", newMessage);
        if (file) formData.append("fileUrl", file);

        const tempId = Date.now();
        const tempMessage = {
            _id: tempId,
            sender: { _id: loggedInUserId },
            receiverId: userId,
            text: newMessage,
            fileUrl: filePreview,
            fileType: file ? file.type : null,
            pending: true,
            error: false,
        };

        setMessages((prev) => [...prev, tempMessage]); // Directly append to messages
        setNewMessage("");
        setFile(null);
        setFilePreview(null);

        try {
            socket.emit("sendMessage", { ...tempMessage, tempId });

            const response = await axios.post(
                "http://localhost:8000/api/v1/chats/send",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data) {
                socket.emit("messageSent", { ...response.data, tempId });
            }
        } catch (error) {
            console.error("❌ Error sending message:", error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === tempId ? { ...msg, pending: false, error: true } : msg
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

    const showProfile = (personId) => {
        navigate(`/profile/${personId}`)
    }

    return (
        <div className="chat-page">
            <div className="chat-header">
                {chatUser && (
                    <>
                        <img src={chatUser.profileImage} alt="User" className="profile-photo" />
                        <h2 
                            onClick={() => chatUser?._id && showProfile(chatUser._id)}
                            style={{ cursor: "pointer"}}
                        >
                            {chatUser?.username}
                        </h2>
                    </>
                )}
            </div>

            <div className="messages">
                {messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const senderId = msg.sender?._id || msg.senderId;
                        return (
                            <div
                                key={msg._id || index}
                                className={`message ${senderId === loggedInUserId ? "sent" : "received"}
                                ${msg.pending ? "pending" : ""} ${msg.error ? "error" : ""}`}
                                style={{ alignSelf: senderId === loggedInUserId ? "flex-end" : "flex-start" }}
                                onClick={() => msg.error && sendMessage()}
                            >
                                {msg.text && <span>{msg.text}</span>}

                                {msg.fileUrl && (
                                    <>
                                        {msg.fileUrl.endsWith(".png") || msg.fileUrl.endsWith(".jpg") || msg.fileUrl.endsWith(".jpeg") || msg.fileUrl.endsWith(".gif") ? (
                                            <img src={msg.fileUrl} alt="Uploaded file" className="message-file-preview" />
                                        ) : msg.fileUrl.endsWith(".mp4") || msg.fileUrl.endsWith(".mov") ? (
                                            <video controls className="message-file-preview">
                                                <source src={msg.fileUrl} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : (
                                            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                                                📎 Download File
                                            </a>
                                        )}
                                    </>
                                )}

                                {msg.error && <small>❌ Failed. Tap to retry.</small>}
                            </div>
                        );
                    })
                ) : (
                    <p>No messages yet</p>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                {filePreview && (
                    <div className="file-preview">
                        <img src={filePreview} alt="Preview" className="preview-image" />
                        <button className="remove-preview" onClick={() => {
                            setFilePreview(null);
                            setFile(null);
                        }}>✖</button>
            </div>
                )}
    
    <div className="input-controls">
        <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
        />
        <input type="file" onChange={handleFileChange} style={{ display: "none" }} id="fileInput" />
        <label htmlFor="fileInput" className="file-upload-button">➕</label>
        <button onClick={sendMessage}>Send</button>
    </div>
</div>
        </div>
    );
};

export default ChatPage;
