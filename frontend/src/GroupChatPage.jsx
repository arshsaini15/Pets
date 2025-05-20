import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { socket } from "./utils/socket.js";
import "./GroupChatPage.css";

const GroupChatPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connections, setConnections] = useState([]);
  const [senderName, setSenderName] = useState('');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const messageListRef = useRef(null);

  // Fetch logged-in user's name
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSenderName(response.data.username);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchUser();
  }, [userId, token]);

  // Fetch user's connections
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConnections(response.data.connections);
      } catch (err) {
        console.error('Error fetching connections:', err);
      }
    };
    fetchDetails();
  }, [userId, token]);

  // Fetch group info and messages
  useEffect(() => {
    if (!groupId) return;

    const fetchGroupInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroup(res.data);
      } catch (err) {
        console.error("Failed to load group info", err);
      }
    };

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/groups/messages/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          setMessages(res.data);
        } else if (res.data.messages && Array.isArray(res.data.messages)) {
          setMessages(res.data.messages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to load messages", err);
        setMessages([]);
      }
    };

    Promise.all([fetchGroupInfo(), fetchMessages()]).then(() => setLoading(false));
  }, [groupId, token]);


 
  const handleConnect = async (targetUserId) => {
  try {
    const res = await axios.post(
      'http://localhost:8000/api/v1/users/connect',
      { userId: targetUserId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200 || res.status === 201) {
      // Add the newly connected user to the `connections` state
      setConnections((prevConnections) => [
        ...prevConnections,
        { _id: targetUserId }
      ]);
    }
  } catch (err) {
    console.error('Error adding connection:', err);
  }
};


  // Socket.io event handling
  useEffect(() => {
    if (!groupId) return;

    socket.emit("joinGroup", groupId);

    socket.on("newGroupMessage", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.emit("leaveGroup", groupId);
      socket.off("newGroupMessage");
    };
  }, [groupId]);

  // Auto-scroll to bottom of messages on new message
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      text: message,
      groupId,
      sender: userId,
      senderName: senderName,
      createdAt: new Date().toISOString(),
    };

    socket.emit("sendGroupMessage", newMessage);

    axios.post(`http://localhost:8000/api/v1/groups/messages`, newMessage, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(err => {
      console.error('Failed to store message:', err);
    });

    setMessage("");
  };

  if (loading) return <p>Loading group chat...</p>;
  if (!group) return <p>Group not found.</p>;

  // Check participants not in connections
  const nonConnectionParticipants = group.participants.filter(
  (participant) => 
    participant._id !== userId && // ignore yourself here
    !connections.some((conn) => conn._id === participant._id)
    );

  return (
    <div className="group-chat-page">
      <h2>{group.name}</h2>

      <div className="group-info">
        <p><strong>Members:</strong> {group.participants.length}</p>
        <ul>
  {group.participants.map((user) => {
    const isConnected = connections.some(conn => conn._id === user._id);
    const isSelf = user._id === userId;

    return (
      <li key={user._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <img
          src={user.profileImage || "/default-avatar.png"}
          alt={user.username}
          style={{ width: "30px", height: "30px", borderRadius: "50%" }}
        />
        <span>{user.username}</span>

        {!isSelf && !isConnected && (
          <button
            onClick={() => handleConnect(user._id)}
            style={{
              marginLeft: 'auto',
              padding: '4px 8px',
              cursor: 'pointer',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Connect
          </button>
        )}
      </li>
    );
  })}
</ul>
</div>


      <div className="chat-box">
        <div className="message-list" ref={messageListRef}>
          {(Array.isArray(messages) ? messages : []).map((msg, index) => (
            <div key={index} className="message">
              <strong>
                {msg.sender._id === userId ? 'You' : msg.sender.username || 'Unknown'}
              </strong>: {msg.text}
            </div>
          ))}
        </div>

        <div className="message-input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatPage;