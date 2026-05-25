import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import s from './Authorisation.module.css';
import togetherLogo from './../Header/Together_logo.png'

const Authorisation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(location.state?.isSignUp || false);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const from = location.state?.from?.pathname || '/profile';

    const validate = () => {
        const errors = {};

        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Email is invalid';
        }

        if (!password) {
            errors.password = 'Password is required';
        } else if (isSignUp && password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;
        setLoading(true);

        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) { setError(error.message); setLoading(false); return; }
            if (data.user) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    name: email.split('@')[0],
                    status: 'Online',
                    city: '',
                    country: ''
                });
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) { setError(error.message); setLoading(false); return; }
        }

        setLoading(false);
        navigate(from, { replace: true });
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
    };


    return (
        <div className={s.page}>
            <div className={s.bgGrid}></div>
            <div className={s.glow}></div>

            <div className={s.container}>
                <div className={s.brand}>
                    <div className={s.logoCircle}>
                        <img src={togetherLogo} alt="Together logo" />
                    </div>
                    <h1 className={s.brandTitle}>Together</h1>
                    <p className={s.brandTag}>
                        Where conversations become<br />connections.
                    </p>
                    <div className={s.divider}></div>
                    <div className={s.features}>
                        <div className={s.feature}>
                            <span className={s.dot}></span>
                            Real-time messaging
                        </div>
                        <div className={s.feature}>
                            <span className={s.dot}></span>
                            Built for speed
                        </div>
                        <div className={s.feature}>
                            <span className={s.dot}></span>
                            Privacy first
                        </div>
                    </div>
                </div>

                <div className={s.card}>
                    <div className={s.cardHeader}>
                        <h2>{isSignUp ? 'Create account' : 'Welcome back'}</h2>
                        <p>{isSignUp ? 'Join the community today' : 'Sign in to continue'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className={s.form} noValidate>
                        <div className={s.field}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={handleEmailChange}
                                className={fieldErrors.email ? s.inputError : ''}
                            />
                            {fieldErrors.email &&
                                <div className={s.fieldError}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span>{fieldErrors.email}</span>
                                </div>
                            }
                        </div>

                        <div className={s.field}>
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={handlePasswordChange}
                                className={fieldErrors.password ? s.inputError : ''}
                            />
                            {fieldErrors.password &&
                                <div className={s.fieldError}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span>{fieldErrors.password}</span>
                                </div>
                            }
                        </div>

                        {error && <div className={s.error}>{error}</div>}

                        <button type="submit" disabled={loading} className={s.submit}>
                            <span>{loading ? 'Loading...' : (isSignUp ? 'Create account' : 'Sign in')}</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className={s.toggle}>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setFieldErrors({}); setError(''); }}>
                                {isSignUp ? 'Sign in' : 'Sign up'}
                            </button>
                        </div>

                        <Link to="/welcome" className={s.backLink}>← Continue as guest</Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Authorisation;