import React from 'react';
import content_area from './Profile.module.css';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import MyPostsContainer from './MyPosts/MyPosts_Container';

const Profile = (props) => {
  return (
    <div className={content_area.profile}>
      <ProfileInfo store={props.store} />
      <MyPostsContainer store={props.store} />
       </div>
  )
}

export default Profile;