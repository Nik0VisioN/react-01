import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import s from './Users.module.css';
import { usePresence } from '../Auth/PresenceContext';

const LABELS = { none: 'Add friend', requested: 'Requested', incoming: 'Add back', friends: 'Friends' };

const friendState = (u) => {
    if (u.followed && u.theyFollow) return 'friends';
    if (u.followed) return 'requested';
    if (u.theyFollow) return 'incoming';
    return 'none';
};

const Users = (props) => {
    const { onlineIds } = usePresence();
    const [q, setQ] = useState('');

    const query = q.trim().toLowerCase();
    const filtered = props.users.filter(u => (u.name || '').toLowerCase().includes(query));

    const onToggle = (u) => (u.followed ? props.unfollow(u.id) : props.follow(u.id));

    return (
        <div className={s.page}>
            <div className={s.search}>
                <svg className={s.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
                <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Search people by name…"
                />
            </div>

            <div className={s.list}>
                {filtered.length === 0 ? (
                    <div className={s.empty}>No people found.</div>
                ) : filtered.map(u => {
                    const state = friendState(u);
                    const online = onlineIds.has(u.id);
                    const loc = [u.location?.city, u.location?.country].filter(Boolean).join(', ');

                    return (
                        <div key={u.id} className={s.user}>
                            <Link to={`/profile/${u.id}`} className={s.avatarLink}>
                                <div className={s.avatar}>
                                    {u.photoUrl
                                        ? <img src={u.photoUrl} alt={u.name} />
                                        : (u.name?.[0]?.toUpperCase() || '?')}
                                </div>
                                {online && <span className={s.online}></span>}
                            </Link>

                            <div className={s.info}>
                                <Link to={`/profile/${u.id}`} className={s.nameLink}>
                                    <span className={s.name}>{u.name || 'Unnamed'}</span>
                                </Link>
                                <span className={s.sub}>{loc || u.status || ''}</span>
                            </div>

                            <button
                                className={`${s.friendBtn} ${s['fr_' + state]}`}
                                onClick={() => onToggle(u)}
                            >
                                {LABELS[state]}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Users;