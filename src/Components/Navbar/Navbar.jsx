import React, { useEffect, useState } from 'react';
import navbar_space from './Navbar.module.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    const [isOpen, setIsOpen] = useState(false);  // state menu open/close

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const closeMenu = () => setIsOpen(false);     // close menu on link click or overlay click

    return (
        <>

            <button
                className={navbar_space.burger}
                onClick={() => setIsOpen(prev => !prev)}
                aria-label="Menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* overlay */}
            {isOpen && <div className={navbar_space.overlay} onClick={closeMenu}></div>}

            <nav className={`${navbar_space.nav} ${isOpen ? navbar_space.open : ''}`}>
                <div className={navbar_space.theme_wrapper}>
                    <div
                        className={`${navbar_space.theme_switch} ${isDark ? navbar_space.dark : ''}`}
                        onClick={() => setIsDark(prev => !prev)}
                    >
                        <div className={navbar_space.track}>
                            <div className={navbar_space.thumb}></div>
                        </div>
                    </div>
                </div>

                <div><NavLink to="/profile" className={navbar_space.text_nav} onClick={closeMenu}>Profile</NavLink></div>
                <div><NavLink to="/chats" className={navbar_space.text_nav} onClick={closeMenu}>Chats</NavLink></div>
                <div><NavLink to="/users" className={navbar_space.text_nav} onClick={closeMenu}>Users</NavLink></div>
                <div><NavLink to="/music" className={navbar_space.text_nav} onClick={closeMenu}>Music</NavLink></div>
                <div><NavLink to="/saved" className={navbar_space.text_nav} onClick={closeMenu}>Saved</NavLink></div>
            </nav>
        </>
    )
}

export default Navbar;