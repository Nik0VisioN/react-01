import React, { useEffect, useState } from 'react';
import s from './ThemeSwitch.module.css';

const ThemeSwitch = () => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    useEffect(() => { //Change theme on state change + save to localStorage
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    useEffect(() => { // Listen for changes in localStorage (e.g. from another tab)
        const handleStorage = (e) => {
            if (e.key === 'theme') setIsDark(e.newValue === 'dark');
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <div
            className={`${s.theme_switch} ${isDark ? s.dark : ''}`}
            onClick={() => setIsDark(prev => !prev)}
            role="button"
            aria-label="Toggle theme"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsDark(prev => !prev)}
        >
            <div className={s.track}>
                <div className={s.thumb}></div>
            </div>
        </div>
    );
};

export default ThemeSwitch;