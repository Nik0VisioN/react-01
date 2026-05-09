import React from 'react';
import content_area from './Profile.module.css';
import MyPosts from './MyPosts/MyPosts';
import ProfileInfo from './ProfileInfo/ProfileInfo';

const Profile = (props) => {
  return (
    <div className={content_area.profile}>
      <ProfileInfo />
      <MyPosts posts={props.state.postsData} />
    </div>

  )
}

export default Profile;