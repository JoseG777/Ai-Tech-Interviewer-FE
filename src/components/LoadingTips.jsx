import React, { useState, useEffect } from "react";
import "../styles/LoadingTips.css";
import logo from "../assets/EVE.png"; 

const tipsArray = [
    "Clarify the problem requirements before starting to code.",
    "Break down the problem into smaller parts.",
    "Think aloud while coding to explain your thought process.",
    "Write clean, readable code with proper variable names.",
    "Optimize your solution for time and space complexity.",
    "Think about different edge cases.",
    "Ask for feedback on your approach during the interview.",
    "Stay calm and composed during the interview.",
    "Don’t be afraid to ask clarifying questions.",
    "Plan your approach before writing code.",
    "Manage your time effectively during the interview.",
    "Double-check your code for any mistakes.",
    "Explain the reasoning behind your decisions.",
    "Be prepared to discuss trade-offs in your approach.",
    "Show your enthusiasm for the role and company.",
    "Use examples to illustrate your points.",
    "Remember to smile and make a good impression.",
    "Stay focused and avoid distractions.",
    "If you get stuck, take a moment to think calmly.",
    "Communicate your thought process clearly and concisely.",
    "If you realize a mistake, acknowledge it and correct it.",
    "Stay confident in your abilities.",
    "Pace yourself and don’t rush through the problem.",
    "Show your problem-solving skills, even if you don’t reach the perfect solution."
];

function getRandomTips(tips, count) {
    const shuffled = tips.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function LoadingTips() {
    const [displayedTips, setDisplayedTips] = useState([]);

    useEffect(() => {
        setDisplayedTips(getRandomTips(tipsArray, 3));

        const interval = setInterval(() => {
            setDisplayedTips(getRandomTips(tipsArray, 3));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-tips-container">
            <img src={logo} alt="Logo" className="fading-logo" />
            {displayedTips.map((tip, index) => (
                <div className="loading-tips" key={index}>
                    <p>{tip}</p>
                </div>
            ))}
        </div>
    );
}

export default LoadingTips;
