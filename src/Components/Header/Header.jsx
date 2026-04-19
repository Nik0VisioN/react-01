import React, { Component } from 'react';
import logo_channel_main from './Together_logo.png';
import header_space from './Header.module.css';


const Header = () => {
    return (
        <>
            <header className={header_space.header}>
                <img src={logo_channel_main} alt="Logo_Channel_Main" />
                <span className={header_space.text}>
                    Together
                </span>
            </header>
        </>
    );
}

export default Header;