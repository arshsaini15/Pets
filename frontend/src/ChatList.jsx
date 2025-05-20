import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom"; // ⬅️ import useSearchParams
import axios from "axios";
import { socket } from "./utils/socket.js";
import "./ChatList.css";

const ChatList = () => {
    const [searchParams] = useSearchParams();
    const defaultTab = searchParams.get("view") === "groups" ? "groups" : "chats";

    const [activeTab, setActiveTab] = useState(defaultTab);
    const [chatUsers, setChatUsers] = useState([]);
    const [groupChats, setGroupChats] = useState([]); // Ensure groupChats is defined

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        socket.on("receiveMessage", (message) => {
            console.log("Received message:", message);

            setChatUsers((prevChatUsers) => {
                const existingChat = prevChatUsers.find(chat =>
                    chat.participants.some(user => user._id === message.senderId || user._id === message.receiverId)
                );

                if (!existingChat) {
                    return [...prevChatUsers, { participants: [{ _id: message.senderId }] }];
                }
                return prevChatUsers;
            });
        });

        return () => socket.off("receiveMessage");
    }, []);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/v1/chats/users", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const filteredChats = response.data.filter(chat => chat.messages && chat.messages.length > 0);
                setChatUsers(filteredChats);
            })
            .catch((error) => console.error("Error fetching chat users:", error));
    }, []);

    const renderChats = () => {
        if (activeTab === "chats") {
            return chatUsers.length > 0 ? (
                <ul>
                    {chatUsers.map((chat) => {
                        const otherUser = chat.participants.find((user) => user._id !== userId);

                        return (
                            <li key={otherUser?._id}>
                                <Link to={`/chat/${otherUser?._id}`}>
                                    <img src={otherUser?.profileImage || "default-avatar.png"} alt={otherUser?.username} />
                                    <span className="chat-name">{otherUser?.username}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No direct chats yet.</p>
            );
        } else {
            return groupChats.length > 0 ? (
                <ul>
                    {groupChats.map((group) => (
                        <li key={group._id}>
                            <Link to={`/group/${group._id}`}>
                                <img src={group.groupImage || "default-group.png"} alt={group.name} />
                                <span className="chat-name">{group.name}</span>
                                <span className="member-count">{group.participants.length} members</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No group chats yet.</p>
            );
        }
    };

    return (
        <div className="chat-list">
            <h2>Messages</h2>

            <div className="tab-toggle">
                <div className={`tab-slider ${activeTab}`}></div>
                <button 
                    className={`tab-button ${activeTab === "chats" ? "active" : ""}`}
                    onClick={() => setActiveTab("chats")}
                >
                    Chats
                </button>
                <button 
                    className={`tab-button ${activeTab === "groups" ? "active" : ""}`}
                    onClick={() => setActiveTab("groups")}
                >
                    Groups
                </button>
            </div>

            <div className="chat-content">
                {renderChats()}
            </div>

            {activeTab === "groups" && (
                <button className="create-group-btn">
                    <Link to="/create-group">+ Create New Group</Link>
                </button>
            )}
        </div>
    );
};

export default ChatList;