import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import s from './LoginRequired.module.css';

const LoginRequired = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleEsc);
        // lock scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const goToLogin = () => {
        onClose();
        // move to login page and save current location for redirect after login
        navigate('/login', { state: { from: location }, replace: false });
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className={s.overlay} onClick={handleOverlayClick}>
            <div className={s.bgGrid}></div>
            <div className={s.glow}></div>

            <div className={s.modal}>
                <button className={s.closeBtn} onClick={onClose} aria-label="Close">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6l12 12M6 18L18 6" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <div className={s.iconWrap}>
                    <div className={s.icon}>
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                </div>

                <h2 className={s.title}>Login required</h2>
                <p className={s.text}>
                    To continue, please log in to your account<br />
                    or create a new one.
                </p>

                <div className={s.actions}>
                    <button className={s.btnSecondary} onClick={onClose}>
                        Dismiss
                    </button>
                    <button className={s.btnPrimary} onClick={goToLogin}>
                        <span>Log in</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginRequired;