import React, { useState } from 'react';
import navbar_space from './Navbar.module.css';
import { NavLink } from 'react-router-dom';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);  // state menu open/close
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
                    <ThemeSwitch />
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