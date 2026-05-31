import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import s from './ProfileInfo.module.css';
import { connect } from 'react-redux';

function timeAgo(date) {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return 'recently';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
}

const FRIEND_LABELS = {
  none: 'Add friend',
  requested: 'Request sent',
  incoming: 'Add back',
  friends: 'Friends',
};

const ProfileInfo = (props) => {
  const { name, location, locationVisible, photo, cover, bio, age, joined, followers, following, posts } = props.userInfo;
  const { isOwnProfile, isOnline, lastSeen, isFriends, friendState, friendBusy, onFriendClick } = props;

  const canSee = isOwnProfile || isFriends;

  const showLocation = location && (locationVisible !== false || isOwnProfile);
  const locationHidden = isOwnProfile && locationVisible === false;

  // tik 1 time every 30 seconds to update "Last seen" text for offline profiles, because it can become outdated while user is on profile page (e.g. "Last seen: 5m ago" -> "Last seen: 6m ago"), so we need to update it periodically. For online profiles we show "Online", so no need to update it.
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const statusText = isOnline
    ? 'Online'
    : (lastSeen ? `Last seen ${timeAgo(new Date(lastSeen))}` : 'Offline');

  const friendIcon = {
    none: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>,
    incoming: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>,
    requested: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
    friends: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>,
  }[friendState];

  return (
    <div className={s.profile_info}>
      <div
        className={s.cover}
        style={cover ? { backgroundImage: `url(${cover})` } : undefined}
      >
        {!cover && <div className={s.coverGrid}></div>}

        {isOwnProfile ? (
          <Link to="/profile/edit" className={s.editBtn}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            Edit profile
          </Link>
        ) : onFriendClick ? (
          <button
            className={`${s.friendBtn} ${s['fr_' + friendState]}`}
            onClick={onFriendClick}
            disabled={friendBusy}
          >
            {friendIcon}
            {FRIEND_LABELS[friendState]}
          </button>
        ) : null}
      </div>

      <div className={s.body}>
        <div className={s.avatarWrap}>
          <div className={s.avatar}>
            {photo
              ? <img src={photo} alt={name} />
              : (name ? name[0].toUpperCase() : '?')}
          </div>
          <span className={`${s.presence} ${isOnline ? s.online : s.offline}`}></span>
        </div>

        <div className={s.ident}>
          <div className={s.nameRow}>
            <h2 className={s.name}>{name || 'Unnamed'}</h2>
            {canSee && (
              <span className={`${s.badge} ${isOnline ? '' : s.off}`}>
                <span className={s.dot}></span>
                {statusText}
              </span>
            )}
          </div>

          {canSee && bio && <p className={s.bio}>{bio}</p>}

          <div className={s.meta}>
            {canSee && showLocation && (
              <span>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {location}
                {locationHidden && <span style={{ opacity: 0.55, fontSize: '11px', marginLeft: '4px' }}>· hidden</span>}
              </span>
            )}
            {canSee && age && (
              <span>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" /><path d="M2 21h20M7 8v3M12 8v3M17 8v3" /></svg>
                {age} y/o
              </span>
            )}
            {joined && (
              <span>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                Joined {joined}
              </span>
            )}
          </div>
        </div>

        {canSee ? (
          <div className={s.stats}>
            <div className={s.stat}><b>{followers ?? 0}</b><span>Followers</span></div>
            <div className={s.stat}><b>{following ?? 0}</b><span>Following</span></div>
            <div className={s.stat}><b>{posts ?? 0}</b><span>Posts</span></div>
          </div>
        ) : (
          <div className={s.gateHint}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Become friends to see more
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.profilePage.userInfo
});

export default connect(mapStateToProps)(ProfileInfo);