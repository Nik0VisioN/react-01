import React from 'react';
import content_area from './Profile.module.css';
import MyPosts from './MyPosts/MyPosts';
import ProfileInfo from './ProfileInfo/ProfileInfo';

const Profile = (props) => {
  return (
    <div className={content_area.profile}>
      <ProfileInfo state={props.profilePage} />
      <MyPosts 
      posts={props.profilePage.postsData} 
      newPostText={props.profilePage.newPostText}
      dispatch={props.dispatch} />
       </div>
  )
}

export default Profile;