import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './AddConnections.css'
import { UserPlus } from 'lucide-react'

const AddConnections = () => {
  const [statusMessage, setStatusMessage] = useState(null)
  const [users, setUsers] = useState([])
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)

  const token = localStorage.getItem('token')

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/allusers/showallusers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsers(res.data.users)
    } catch (err) {
      console.error('Error fetching users:', err)
      setStatusMessage('Failed to fetch users.')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyConnections = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setConnections(res.data.connections || [])
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
  }

  useEffect(() => {
    fetchAllUsers()
    fetchMyConnections()
  }, [])

  const addConnection = async (userId) => {
    setConnecting(true)
    try {
      await axios.post(
        'http://localhost:8000/api/v1/users/connect',
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setStatusMessage('Connection added successfully!')
      fetchMyConnections()
      fetchAllUsers()
    } catch (err) {
      console.error('Error adding connection:', err)
      setStatusMessage('Failed to add connection.')
    } finally {
      setConnecting(false)
    }
  }

  const connectedIds = new Set(connections.map(conn => conn._id))

  const filteredUsers = users.filter(user => !connectedIds.has(user._id))

  // Default avatar if profile image is missing
  const getDefaultAvatar = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U'
  }

  return (
    <div className="add-connection-container">
      <h2 className="page-title">Add New Connections</h2>
      
      {statusMessage && (
        <div className={`status-message ${statusMessage.includes('success') ? 'success' : 'error'}`}>
          {statusMessage}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-users-message">
          <p>No new users to connect with at this time.</p>
        </div>
      ) : (
        <div className="user-cards-container">
          {filteredUsers.map(user => (
            <div key={user._id} className="user-card">
              <div className="user-avatar">
                {user.profileImage ? (
                  <img 
                    className="avatar-img" 
                    src={user.profileImage} 
                    alt={user.username} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentNode.innerHTML = getDefaultAvatar(user.username);
                    }}
                  />
                ) : (
                  getDefaultAvatar(user.username)
                )}
              </div>
              <div className="user-info">
                <h3>{user.username}</h3>
                <p className="user-email">{user.email}</p>
              </div>
              <button 
                className="connect-button"
                onClick={() => addConnection(user._id)}
                disabled={connecting}
              >
                <UserPlus size={20} />
                <span>Connect</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddConnections