import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Group.css";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [connections, setConnections] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Fetch user's connections
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setConnections(res.data.connections || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load connections", err);
        setLoading(false);
      });
  }, [token]);

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!groupName.trim()) {
    alert("Group name cannot be empty");
    return;
  }

  if (selectedUsers.length === 0) {
    alert("Select at least one member to create a group.");
    return;
  }

  console.log(selectedUsers)

  try {
    const response = await axios.post(
      "http://localhost:8000/api/v1/groups/create-group",
      { name: groupName, participants: selectedUsers },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Group created:", response.data);
    navigate("/chat?view=groups");
  } catch (err) {
    console.error("Error creating group:", err);
    alert("Failed to create group. Try again.");
  }
};





  return (
    <div className="create-group-page">
      <h2>Create New Group</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Group Name:
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            required
          />
        </label>

        <h3>Select Members (Your Connections)</h3>
        {loading ? (
          <p>Loading connections...</p>
        ) : connections.length > 0 ? (
          <ul className="user-list">
            {connections.map((user) => (
              <li
                key={user._id}
                className={selectedUsers.includes(user._id) ? "selected" : ""}
                onClick={() => toggleUser(user._id)}
              >
                <img src={user.profileImage || "/default-avatar.png"} alt={user.username} />
                <span>{user.username}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No connections found to add.</p>
        )}

        <button type="submit" className="submit-btn">Create Group</button>
      </form>
    </div>
  );
};

export default CreateGroup;