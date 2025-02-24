import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';

const SignIn = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showWelcomePopup, setShowWelcomePopup] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        } else {
            setLoading(false);
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(
                'http://localhost:8000/api/v1/users/signin',
                formData,
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );
    
            const { token, user } = response.data;
            console.log(response.data)
            
            if (!user || !user.username) {
                throw new Error("Invalid user data received");
            }

            localStorage.setItem('token', token);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('username', user.username);

            navigate('/'); 
        } catch (error) {
            console.error('Error signing in:', error.response?.data || error.message);
        }    
    };

    const closePopup = () => setShowWelcomePopup(false);

    useEffect(() => {
        const timer = setTimeout(closePopup, 3000);
        return () => clearTimeout(timer);
    }, []);

    // ✅ Prevent rendering if already logged in
    if (loading || localStorage.getItem('token')) return null;

    return (
        <>
            {showWelcomePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Welcome! Please enter your details</p>
                        <button onClick={closePopup}>OK</button>
                    </div>
                </div>
            )}
            <div className='container'>
                <div className='headings'>
                    <h1>Sign in to your account</h1>
                </div>
                <div className='formPage'>
                    <form onSubmit={handleSubmit}>
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
                        <input type="submit" value='Submit'/>
                    </form>
                    <p className='linkTag'>
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default SignIn;