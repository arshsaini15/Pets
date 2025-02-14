import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/v1/admin/login', {
                email,
                password
            });

            if (response.status === 200) {
                console.log('Login successful:', response.data);
                localStorage.setItem('adminToken', response.data.token);
                alert('Login successful!');
                navigate('/homepage');
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="signup-container">
            <h1 className="signup-header">Sign In To Your Admin Account</h1>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="signup-input-group">
                    <label className="signup-label">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="signup-input"
                        required
                    />
                </div>
                <div className="signup-input-group">
                    <label className="signup-label">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="signup-input"
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="signup-button">Sign In</button>
            </form>

            <p className='linkTag'>
                Don't have an account? <Link to="/">Sign up</Link>
            </p>
        </div>
    );
};

export default SignIn;