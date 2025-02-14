import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
        }
    }, [navigate]);


    return (
        <nav className="navbar">
            <Link to="/mainpage" className="navbar-logo"><h1>🐾</h1></Link>
            <ul className="navbar-links">
                <li><Link to="/pets">Pets</Link></li>
                <li><Link to="/items">Items</Link></li>
                <li><Link to="/chat">Chat</Link></li>
                <li><Link to="/discuss">Discuss</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/settings">Settings</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar