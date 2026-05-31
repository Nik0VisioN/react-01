import React, { useEffect, useRef, useState } from 'react';
import logo_channel_main from './Together_logo.png';
import s from './Header.module.css';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';

const Header = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null); // { name, photo_url }
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  // find profile on login and when session changes (e.g. after page reload)
  useEffect(() => {
    if (!userId) { setProfile(null); return; }
    let active = true;
    supabase.from('profiles').select('name, photo_url').eq('id', userId).single()
      .then(({ data }) => { if (active && data) setProfile(data); });
    return () => { active = false; };
  }, [userId]);

  // close popups on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/welcome');
  };

  const onSearchKey = (e) => {
    if (e.key === 'Enter' && q.trim()) navigate('/users'); // TODO: настоящий поиск — задача №3
  };

  const handle = (profile?.name || session?.user?.email?.split('@')[0] || 'me').toLowerCase();
  const initial = (profile?.name || session?.user?.email || '?')[0].toUpperCase();

  return (
    <header className={s.header}>
      {/* logo */}
      <div className={s.brand}>
        <img src={logo_channel_main} alt="Logo" className={s.logoImg} />
        <span className={s.brandName}>Together</span>
      </div>

      {/* search in center */}
      <div className={s.center}>
        <div className={s.search}>
          <svg className={s.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onSearchKey}
            placeholder="Search people…"
          />
        </div>
      </div>

      {/* right cluster */}
      {session ? (
        <div className={s.actions}>
          <Link to="/profile" className={s.createBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            <span className={s.createText}>Create</span>
          </Link>

          <Link to="/chats" className={s.iconBtn} aria-label="Messages" title="Messages">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </Link>

          {/* notifications */}
          <div className={s.popWrap} ref={notifRef}>
            <button
              className={s.iconBtn}
              aria-label="Notifications"
              title="Notifications"
              onClick={() => { setNotifOpen(v => !v); setMenuOpen(false); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
            </button>

            <div className={`${s.dd} ${s.ddNotif} ${notifOpen ? s.ddOpen : ''}`}>
              <div className={s.ddHead}><b>Notifications</b></div>
              <div className={s.empty}>No notifications yet.</div>
            </div>
          </div>

          {/* avatar + menu */}
          <div className={s.popWrap} ref={menuRef}>
            <button
              className={s.avatarBtn}
              aria-label="Account menu"
              onClick={() => { setMenuOpen(v => !v); setNotifOpen(false); }}
            >
              <span className={s.avInner}>
                {profile?.photo_url
                  ? <img src={profile.photo_url} alt="me" />
                  : initial}
              </span>
              <span className={s.dot}></span>
            </button>

            <div className={`${s.dd} ${menuOpen ? s.ddOpen : ''}`}>
              <div className={s.ddProfile}>
                <div className={s.ddAv}>
                  {profile?.photo_url ? <img src={profile.photo_url} alt="me" /> : initial}
                </div>
                <div>
                  <div className={s.ddName}>{profile?.name || 'My profile'}</div>
                  <div className={s.ddHandle}>@{handle}</div>
                </div>
              </div>

              <div className={s.sep}></div>

              <Link to="/profile" className={s.menuItem} onClick={() => setMenuOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                My profile
              </Link>

              <Link to="/saved" className={s.menuItem} onClick={() => setMenuOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                Saved
              </Link>

              <Link to="/profile/edit" className={s.menuItem} onClick={() => setMenuOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                Settings
              </Link>

              <div className={s.menuItem} role="group">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" /></svg>
                Appearance
                <span className={s.menuSwitch}><ThemeSwitch /></span>
              </div>

              <div className={s.sep}></div>

              <button className={`${s.menuItem} ${s.danger}`} onClick={handleLogout}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={s.actions}>
          <Link to="/login" className={s.authBtn}>Sign In</Link>
        </div>
      )}
    </header>
  );
};

export default Header;