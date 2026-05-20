import React from 'react';
import s from './ProfileInfo.module.css';
import { connect } from 'react-redux';

const ProfileInfo = (props) => {
  const { name, title, location, photo } = props.userInfo;
  return (
    <div className={s.profile_info}>
      <div className={s.avatar}>{photo ? <img src={photo} alt={name} /> : name[0]}</div>
      <div className={s.info}>
        <h2>{name}</h2>
        <p>{title} · {location}</p>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  userInfo: state.profilePage.userInfo
});

export default connect(mapStateToProps)(ProfileInfo);