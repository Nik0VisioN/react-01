import React from 'react';
import logo_channel_main from './Together_logo.png';
import header_space from './Header.module.css';


const Header = () => {
  return (
    <header className={header_space.header}>
      <div className={header_space.logo}>
        <img src={logo_channel_main} alt="Logo" />
        <span className={header_space.text}>Together</span>
      </div>
    </header>
  );
}

export default Header;