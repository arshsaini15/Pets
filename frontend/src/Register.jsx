import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        profileImage: null,
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profileImage: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        if (formData.profileImage) {
            data.append('profileImage', formData.profileImage);
        }

        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('User registered successfully:', response.data);
            
            // Store the access token in localStorage
            localStorage.setItem('accessToken', response.data.accessToken);
            
            // Clear the form after successful registration
            setFormData({
                username: '',
                email: '',
                password: '',
                profileImage: null,
            });

            // Navigate to the Sign In page
            navigate('/signin');
        } catch (error) {
            console.error('Error registering user:', error);
            setError(error.response?.data?.message || 'An error occurred during registration');
        }
    };

    return (
        <div className='container'>
            <div className='headings'>
                <h1>Sign up</h1>
            </div>
            <div className='formPage'>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>} {/* Show error message */}
                    <input 
                        type="text" 
                        name="username" 
                        placeholder='Enter your Name' 
                        value={formData.username} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder='Enter your email' 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder='Enter your password' 
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
                    <input type="submit" value='Submit'/>
                </form>

                <p className='linkTag'>
                    Already have an account? <Link to="/signin">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
