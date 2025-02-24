import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"))
    const [userId, setUserId] = useState(localStorage.getItem("userId"))
    const [username, setUsername] = useState(localStorage.getItem("username"))
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        setUserId(localStorage.getItem("userId"));
        setUsername(localStorage.getItem("username"));
        setIsLoading(false);
    }, []);

    const signIn = (newToken, newUser) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("userId", newUser._id);
        localStorage.setItem("username", newUser.username);

        setToken(newToken);
        setUserId(newUser._id);
        setUsername(newUser.username);
    };

    // ✅ Sign out user & clear data
    const signOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");

        setToken(null);
        setUserId(null);
        setUsername(null);
    };

    return (
        <AuthContext.Provider value={{ userId, username, token, isLoggedIn: !!token, signIn, signOut, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}