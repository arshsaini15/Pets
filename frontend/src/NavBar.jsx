import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaPaw } from "react-icons/fa"; // Import a stylish paw icon
import "./Navbar.css";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        const checkAuth = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
        };

        window.addEventListener("storage", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, []);

    useEffect(() => {
        const originalSetItem = localStorage.setItem;
        const originalRemoveItem = localStorage.removeItem;

        localStorage.setItem = function (key, value) {
            originalSetItem.apply(this, arguments);
            if (key === "token") {
                setIsLoggedIn(!!value);
            }
        };

        localStorage.removeItem = function (key) {
            originalRemoveItem.apply(this, arguments);
            if (key === "token") {
                setIsLoggedIn(false);
            }
        };

        return () => {
            localStorage.setItem = originalSetItem;
            localStorage.removeItem = originalRemoveItem;
        };
    }, []);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <FaPaw className="paw-icon" />
            </Link>
            <ul className="navbar-links">
                <li><Link to="/pets">Pets</Link></li>
                <li><Link to="/items">Items</Link></li>
                <li><Link to="/discuss">Discussions</Link></li>

                {isLoggedIn ? (
                    <>
                        <li><Link to="/chat">Chat</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/settings">Settings</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/signup">Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
