import React from 'react';
import s from './ProfileInfo.module.css';


const ProfileInfo = (props) => {
  return (
    <div className={s.profile_info}>
      <div className={s.avatar}>{props.state.userInfo.photo}</div>
      <div className={s.info}>
        <h2>{props.state.userInfo.name}</h2>
        <p>{props.state.userInfo.title} · {props.state.userInfo.location}</p>
      </div>
    </div>
  )
}

export default ProfileInfo;