import React, { useEffect, useState } from 'react';
import navbar_space from './Navbar.module.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    return (
        <nav className={navbar_space.nav}>
            <div
                className={`${navbar_space.theme_switch} ${isDark ? navbar_space.dark : ''}`}
                onClick={() => setIsDark(prev => !prev)}
            >
                <div className={navbar_space.track}>
                    <div className={navbar_space.thumb}></div>
                </div>
            </div>

            <div><NavLink to="/profile" className={navbar_space.text_nav}>Profile</NavLink></div>
            <div><NavLink to="/chats" className={navbar_space.text_nav}>Chats</NavLink></div>
            <div><NavLink to="/music" className={navbar_space.text_nav}>Music</NavLink></div>
            <div><NavLink to="/saved" className={navbar_space.text_nav}>Saved</NavLink></div>
        </nav>
    )
}

export default Navbar;