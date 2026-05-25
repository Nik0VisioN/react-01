import React from 'react';
import { Link } from 'react-router-dom';
import s from './Welcome.module.css';
import togetherLogo from '../Header/Together_logo.png';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';

const textVersion = 'v0.3';

const Welcome = () => {
    return (
        <div className={s.page}>
            <div className={s.bgGrid}></div>
            <div className={s.glow}></div>

            {/* Top bar */}
            <header className={s.topBar}>
                <div className={s.brand}>
                    <img src={togetherLogo} alt="Together" className={s.brandLogo} />
                    <span className={s.brandName}>Together</span>
                </div>
                <div className={s.topBarActions}>           {/* ← wrapper for two elements */}
                    <ThemeSwitch />
                    <Link to="/login" className={s.signInLink}>Sign in</Link>
                </div>
            </header>

            {/* hero */}
            <section className={s.hero}>
                <div className={s.heroBadge}>
                    <span className={s.dot}></span>
                    Now in beta · {textVersion}
                </div>

                <h1 className={s.heroTitle}>
                    Where conversations<br />
                    become <span className={s.accent}>connections</span>
                </h1>

                <p className={s.heroSubtitle}>
                    A modern social space for builders, creators, and dreamers.
                    Share what you make, follow who inspires you, talk without noise.
                </p>

                <div className={s.heroActions}>
                    <Link to="/login" state={{ isSignUp: true }} className={s.primaryBtn}>
                        <span>Get started — it's free</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                    <Link to="/login" className={s.secondaryBtn}>
                        Sign in
                    </Link>
                </div>

                <p className={s.heroNote}>
                    No credit card. No spam. Delete your account anytime.
                </p>
            </section>

            {/* features */}
            <section className={s.features}>
                <h2 className={s.sectionTitle}>Why Together</h2>
                <p className={s.sectionTagline}>
                    Built with intention, not algorithms.
                </p>

                <div className={s.featureGrid}>
                    <div className={s.featureCard}>
                        <div className={s.featureIcon}>
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                        </div>
                        <h3>Real conversations</h3>
                        <p>
                            No algorithmic feeds. You see posts from people you actually
                            chose to follow, in chronological order. Like the old web,
                            but better.
                        </p>
                    </div>

                    <div className={s.featureCard}>
                        <div className={s.featureIcon}>
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h3>Privacy first</h3>
                        <p>
                            Your data stays yours. We don't sell it, we don't profile you,
                            we don't track you across the web. End of story.
                        </p>
                    </div>

                    <div className={s.featureCard}>
                        <div className={s.featureIcon}>
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                        </div>
                        <h3>Built for speed</h3>
                        <p>
                            Lightweight, fast on slow connections, accessible from
                            anywhere. No bloated frameworks, no infinite scroll traps.
                        </p>
                    </div>

                    <div className={s.featureCard}>
                        <div className={s.featureIcon}>
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <h3>Made for community</h3>
                        <p>
                            Follow makers, builders, artists, writers. Have your own wall,
                            post on others' walls, react with likes. Real social — no
                            performative metrics.
                        </p>
                    </div>
                </div>
            </section>

            {/* preview placeholder */}
            <section className={s.preview}>
                <h2 className={s.sectionTitle}>See it in action</h2>
                <p className={s.sectionTagline}>
                    Browse a sample profile to get a feel for it.
                </p>

                <div className={s.previewCard}>
                    <div className={s.previewWindow}>
                        <div className={s.windowDots}>
                            <span></span><span></span><span></span>
                        </div>
                        <div className={s.windowAddress}>together-ecru.vercel.app/</div>
                    </div>
                    <div className={s.previewContent}>
                        <p className={s.previewPlaceholder}>
                            For screenshots<br />
                            <small>(For screenshots)</small>
                        </p>
                    </div>
                </div>

                {/* for future use */}
                {/*
                <Link to={`/profile/${process.env.REACT_APP_DEV_PROFILE_ID}`} className={s.previewLink}>
                    View developer's profile
                </Link>
                */}
            </section>

            {/* final CTA */}
            <section className={s.cta}>
                <h2 className={s.ctaTitle}>Ready to join?</h2>
                <p className={s.ctaText}>
                    Takes 30 seconds. No phone number, no real name required.
                </p>
                <Link to="/login" state={{ isSignUp: true }} className={s.primaryBtn}>
                    <span>Create your account</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </section>

            {/* footer */}
            <footer className={s.footer}>
                <p>
                    Built by <a href="https://github.com/Nik0VisioN" target="_blank" rel="noopener noreferrer">
                        NikoVisioN</a> · <span>Together {textVersion}</span>
                </p>
            </footer>
        </div>
    );
};

export default Welcome;