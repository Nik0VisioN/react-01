import React from 'react';
import content_area from './Profile.module.css';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import MyPostsContainer from './MyPosts/MyPostsContainer';

const Profile = (props) => {
  return (
    <div className={content_area.profile}>
      <ProfileInfo />
      <MyPostsContainer />
       </div>
  )
}

export default Profile;