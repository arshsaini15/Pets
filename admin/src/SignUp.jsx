import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        profileImage: null,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profileImage: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:8000/api/v1/admin/signup',
                (() => {
                    const fd = new FormData();
                    fd.append('username', formData.username);
                    fd.append('email', formData.email);
                    fd.append('password', formData.password);
                    if (formData.profileImage) {
                        fd.append('profileImage', formData.profileImage);
                    }
                    return fd;
                })(),
                {
                    withCredentials: true,
                }
            );
            
            console.log('User registered successfully');
            navigate('/signin');
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <div className="container">
            <div className="headings">
                <h1>Sign up</h1>
            </div>
            <div className="formPage">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter your Name"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="file"
                        name="profileImage"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    <input type="submit" value="Submit" />
                </form>

                <p className="linkTag">
                    Already have an account? <Link to="/signin">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;