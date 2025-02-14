import { Routes, Route } from 'react-router-dom';
import SignIn from './SignIn';
import HomePage from './HomePage';
import SignUp from './SignUp';
import Dashboard from './Dashboard';

function App() {
    return (
        <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    )
}

export default App