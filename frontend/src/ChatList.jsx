import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { socket } from "./utils/socket.js";
import "./ChatList.css";

const ChatList = () => {
    const [chatUsers, setChatUsers] = useState([]);
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
                    return [...prevChatUsers, { participants: [ { _id: message.senderId } ] }];
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
                console.log(response.data);

                const filteredChats = response.data.filter(chat => chat.messages && chat.messages.length > 0);

                setChatUsers(filteredChats);
            })
            .catch((error) => console.error("Error fetching chat users:", error));
    }, []);

    return (
        <div className="chat-list">
            <h2>Chats</h2>
            {chatUsers.length > 0 ? (
                <ul>
                    {chatUsers.map((chat) => {
                        const otherUser = chat.participants.find((user) => user._id !== userId);

                        return (
                            <li key={otherUser?._id}>
                                <Link to={`/chat/${otherUser?._id}`}>
                                    <img src={otherUser?.profileImage || "default-avatar.png"} alt={otherUser?.username} />
                                    {otherUser?.username}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No chats yet.</p>
            )}
        </div>
    )
}

export default ChatList