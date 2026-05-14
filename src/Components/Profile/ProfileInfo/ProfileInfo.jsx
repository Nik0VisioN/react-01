import React from 'react';
import s from './ProfileInfo.module.css';


const ProfileInfo = (props) => {
  let state = props.store.getState();
  const { name, title, location, photo } = state.profilePage.userInfo;
  return (
    <div className={s.profile_info}>
      <div className={s.avatar}>{photo}</div>
      <div className={s.info}>
        <h2>{name}</h2>
        <p>{title} · {location}</p>
      </div>
    </div>
  )
}

export default ProfileInfo;