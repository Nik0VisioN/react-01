import React from 'react';
import content_area from './ProfileInfo.module.css';
import s from './ProfileInfo.module.css';


const ProfileInfo = () => {
  return (
    <div className={s.profile_info}>
      <div className={s.avatar}>NvN</div>
      <div className={s.info}>
        <h2>NikoVisioN</h2>
        <p>IT Professional · Ukraine</p>
      </div>
    </div>
  )
}

export default ProfileInfo;