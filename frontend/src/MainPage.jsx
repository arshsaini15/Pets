import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./MainPage.css";

const MainPage = () => {
    const navigate = useNavigate();
    const [buttonValue, setButtonValue] = useState("Get Started");

    useEffect(() => {
        const isLoggedIn = !!localStorage.getItem("token");
        setButtonValue(isLoggedIn ? "Exlpore Pets" : "Get Started");
    }, []);

    const handleButtonClick = () => {
        const isLoggedIn = !!localStorage.getItem("token");
        navigate(isLoggedIn ? "/pets" : "/signin");
    };

    return (
        <>
            <div className="mainpage-container">
                <div className="mainpage-content">
                    <p className="pet-message">
                        Pets bring unconditional love and joy to our lives. Cherish every moment with them!
                    </p>
                    <button className="get-started-btn" onClick={handleButtonClick}>
                        {buttonValue}
                        <ArrowRight className="arrow-icon" />
                    </button>
                </div>
            </div>

            <div className="lowerbody">
                <p className="quote"> "Pets are not our whole life, but they make our lives whole.” — Roger Caras</p>
                <p className="quote"> "The world would be a nicer place if everyone had the ability to love as unconditionally as a dog.” — M.K. Clinton</p>
                <p className="quote"> "An animal's eyes have the power to speak a great language.” — Martin Buber</p>
            </div>
        </>
    );
};

export default MainPage;
