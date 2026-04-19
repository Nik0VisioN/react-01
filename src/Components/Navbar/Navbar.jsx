import React, { Component } from 'react';
import navbar_space from './Navbar.module.css';

const Navbar = () => {
    return (
        <nav className={navbar_space.nav}>
            <div>
                <a href="#profile" className={navbar_space.text_nav}>Profile</a>
            </div>
            <div>
                <a href="#chats" className={navbar_space.text_nav}>Chats</a>
            </div>
            <div>
                <a href="#contacts" className={navbar_space.text_nav}>Contacts</a>
            </div>
            <div>
                <a href="#music" className={navbar_space.text_nav}>Music</a>
            </div>
            <div>
                <a href="#calls" className={navbar_space.text_nav}>Calls</a>
            </div>
            <div>
                <a href="#saved_messages" className={navbar_space.text_nav}>Saved</a>
            </div>
        </nav>
    )
}

export default Navbar;