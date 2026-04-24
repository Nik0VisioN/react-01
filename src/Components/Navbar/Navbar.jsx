import React from 'react';
import navbar_space from './Navbar.module.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className={navbar_space.nav}>
            <div>
                <NavLink to="/profile" className={navbar_space.text_nav}>Profile</NavLink>
            </div>
            <div>
                <NavLink to="/chats" className={navbar_space.text_nav}>Chats</NavLink>
            </div>
            <div>
                <NavLink to="/music" className={navbar_space.text_nav}>Music</NavLink>
            </div>  
            <div>
                <NavLink to="/saved" className={navbar_space.text_nav}>Saved</NavLink>
            </div>
        </nav>
    )
}

export default Navbar;