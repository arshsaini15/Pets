import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DiscussPage.css";

const DiscussPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState({});
    const [newPost, setNewPost] = useState({ title: "", content: "", category: "" });
    const [filters, setFilters] = useState(new Set(JSON.parse(localStorage.getItem("filters")) || []));
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        localStorage.setItem("filters", JSON.stringify([...filters]));
    }, [filters]);

    const fetchPosts = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/discuss/allposts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(res.data);
        } catch (error) {
            setError("Failed to fetch discussions. Please try again later.");
            console.error("Error fetching discussions:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFilter = (category) => {
        setFilters((prevFilters) => {
            const newFilters = new Set(prevFilters);
            newFilters.has(category) ? newFilters.delete(category) : newFilters.add(category);
            return newFilters;
        });
    };

    const clearFilters = () => {
        setFilters(new Set());
    };

    const handleLike = async (postId) => {
        try {
            const res = await axios.post(
                `http://localhost:8000/api/v1/discuss/like/${postId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPosts(posts.map(post =>
                post._id === postId
                ? { ...post, likes: res.data.likes, likedByUser: res.data.likedByUser }
                : post
            ));
        } catch (error) {
            alert('You are not authorized');
            console.error("Error liking post:", error);
        }
    };

    const handleCommentChange = (postId, value) => {
        setComments(prevComments => ({
            ...prevComments,
            [postId]: value
        }));
    };

    const handleNewPostChange = (e) => {
        setNewPost({ ...newPost, [e.target.name]: e.target.value });
    };

    const handleAddPost = async () => {
        if (!token) {
            alert("You are not authorized");
            return;
        }

        if (newPost.title.trim() && newPost.content.trim() && newPost.category.trim()) {
            try {
                const res = await axios.post(
                    "http://localhost:8000/api/v1/discuss/newpost",
                    newPost,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPosts([res.data, ...posts]); // Add new post at the top
                setNewPost({ title: "", content: "", category: "" }); // Reset input fields
            } catch (error) {
                alert('You are not authorized');
                console.error("Error adding new post:", error);
            }
        } else {
            alert("Title, content, and category cannot be empty!");
        }
    };

    const handleCommentSubmit = async (postId) => {
        const content = comments[postId];
        if (content.trim()) {
            try {
                const res = await axios.post(
                    `http://localhost:8000/api/v1/discuss/comment/${postId}`,
                    { content },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPosts(posts.map(post =>
                    post._id === postId
                        ? { ...post, comments: [...post.comments, res.data] }
                        : post
                ));
                setComments(prevComments => ({
                    ...prevComments,
                    [postId]: ""
                }));
            } catch (error) {
                alert('You are not authorized');
                console.error("Error adding comment:", error);
            }
        }
    };

    const filteredPosts = filters.size
        ? posts.filter((post) => filters.has(post.category))
        : posts;

    return (
        <div className="discuss-container">
            <h2>Pet Discussions 🐾</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}


            <div className="add-post">
                <h3>Create a New Post</h3>
                <input
                    type="text"
                    name="title"
                    placeholder="Post Title"
                    value={newPost.title}
                    onChange={handleNewPostChange}
                />
                <textarea
                    name="content"
                    placeholder="Post Content"
                    value={newPost.content}
                    onChange={handleNewPostChange}
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={newPost.category}
                    onChange={handleNewPostChange}
                />
                <button onClick={handleAddPost}>Add Post</button>
            </div>

            <div className="filter-buttons">
                {["Facts", "Health", "General", "Training"].map((category) => (
                    <button
                        key={category}
                        className={filters.has(category) ? "active" : ""}
                        onClick={() => toggleFilter(category)}
                    >
                        {category}
                    </button>
                ))}
                {filters.size > 0 && (
                    <button className="clear-filters" onClick={clearFilters}>X</button>
                )}
            </div>

            <div className="posts">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div key={post._id} className="post">
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <span className="category">{post.category}</span>
                            <p className="post-user">
                                <strong>Posted by:</strong> {post.user?.username || "Anonymous"}
                            </p>
                            <div className="post-actions">
                                <button
                                    className={`like-btn ${post.likedByUser ? "liked" : ""}`}
                                    onClick={() => handleLike(post._id)}
                                >
                                    {post.likedByUser ? "❤️" : "🤍"} <span>{post.likes || 0}</span>
                                </button>
                            </div>

                            <div className="comments-section">
                                <div className="comments-list" style={{ maxHeight: "200px", overflowY: "scroll" }}>
                                    {post.comments && post.comments.length > 0 ? (
                                        post.comments.map((comment) => (
                                            <div key={comment._id} className="comment">
                                                <p>{comment.content}</p>
                                                <p>
                                                    <strong
                                                        onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                                                        onClick={() => navigate(`/profile/${comment.user._id}`)}
                                                    >
                                                        {comment.user?.username || "Anonymous"}
                                                    </strong>
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No comments yet. Be the first to comment! 📝</p>
                                    )}
                                </div>
                                <div className="add-comment">
                                    <textarea
                                        value={comments[post._id] || ""}
                                        onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                        placeholder="Add a comment..."
                                    />
                                    <button onClick={() => handleCommentSubmit(post._id)}>
                                        Submit Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No discussions yet. Be the first to post! 📝</p>
                )}
            </div>
        </div>
    );
};

export default DiscussPage;