import React from 'react';
import s from './ProfileInfo.module.css';


const ProfileInfo = (props) => {
  const { name, title, location, photo } = props.state.userInfo;
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