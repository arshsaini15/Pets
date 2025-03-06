import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Loader from "./utils/loading"

import Register from "./Register";
import SignIn from "./SignIn";
import MainPage from "./MainPage";
import ProfilePage from "./ProfilePage";
import ItemPage from "./ItemPage";
import AddPost from "./AddPost";
import ChatList from "./ChatList";
import ChatPage from "./ChatPage";
import DiscussPage from "./DiscussPage";
import CartPage from "./CartPage";
import ProductDetail from "./ProductDetail";
import Connections from "./Connections";
import OtherProfile from "./OtherProfile";
import SettingsPage from "./Settings";
import PetPage from "./PetPage";
import PetProfile from "./PetProfile";
import WishList from "./WishList";

function App() {
    const [loading, setLoading] = useState(true);
    const location = useLocation(); // Detects route changes

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1500); // Simulate page load
        return () => clearTimeout(timer);
    }, [location.pathname]); // Re-run effect when route changes

    return (
        <>
            <NavBar />
            {loading ? (
                <Loader /> // Show Loader when loading
            ) : (
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/signup" element={<Register />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/items" element={<ItemPage />} />
                    <Route path="/addpost" element={<AddPost />} />
                    <Route path="/chat" element={<ChatList />} />
                    <Route path="/chat/:userId" element={<ChatPage />} />
                    <Route path="/discuss" element={<DiscussPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/connections" element={<Connections />} />
                    <Route path="/profile/:userId" element={<OtherProfile />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/pets" element={<PetPage />} />
                    <Route path="/pets/:petId" element={<PetProfile />} />
                    <Route path="/wishlist" element={<WishList />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            )}
        </>
    );
}

export default App;