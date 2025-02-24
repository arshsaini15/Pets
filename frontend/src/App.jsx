import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./NavBar";

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

function App() {
    return (
        <>
            <NavBar />
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
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;