import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket } from "./utils/socket.js";
import axios from "axios";
import "./ChatPage.css";

const ChatPage = () => {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]); // Only stores received messages
    const [senderMessages, setSenderMessages] = useState([]); // Stores sent messages
    const [newMessage, setNewMessage] = useState(""); // Input message
    const [chatUser, setChatUser] = useState(null);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const token = localStorage.getItem("token");
    const loggedInUserId = localStorage.getItem("userId");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            socket.emit("registerUser", storedUserId);
        }
    }, []);

    useEffect(() => {
        socket.on("receiveMessage", (message) => {
            if ((message.sender?._id || message.senderId) === loggedInUserId) return;
            setMessages((prevMessages) => [...prevMessages, message]);
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
            setSenderMessages((prevMessages) =>
                prevMessages.map((msg) =>
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
            sender: { _id: loggedInUserId }, // Ensure sender is always an object
            receiverId: userId,
            text: newMessage,
            fileUrl: filePreview,
            fileType: file ? file.type : null,
            pending: true,
            error: false,
        };

        setSenderMessages((prev) => [...prev, tempMessage]); // Show sent message instantly
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
            setSenderMessages((prev) =>
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
    }, [messages, senderMessages]);

    // Merge messages and senderMessages while maintaining order
    const allMessages = [...messages, ...senderMessages];
    allMessages.sort((a, b) => new Date(a.createdAt || a._id) - new Date(b.createdAt || b._id));

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
                {allMessages.length > 0 ? (
                    allMessages.map((msg, index) => {
                        const senderId = msg.sender?._id || msg.senderId; // Handle missing sender case
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
                        <button className="remove-preview" onClick={() => setFilePreview(null)}>✖</button>
                    </div>
                )}

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
    );
};

export default ChatPage;
