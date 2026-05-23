import React from 'react';
import logo_channel_main from './Together_logo.png';
import s from './Header.module.css';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { Link } from 'react-router-dom';


const Header = () => {
  const { session } = useAuth();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // after logout, you might want to redirect user to login page or home page, depending on your app's flow
  };

  return (
    <header className={s.header}>
      <div className={s.logo}>
        <img src={logo_channel_main} alt="Logo" />
        <span className={s.text}>Together</span>
      </div>

      {session ? (
        <button className={s.authBtn} onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/login" className={s.authBtn}>Sign In</Link>
      )}
    </header>
  );
}

export default Header;