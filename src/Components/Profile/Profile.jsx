import React, { Component } from 'react';

import content_area from './Profile.module.css';
import MyPosts from './MyPosts/MyPosts';

const Profile = () => {
  return (
    <div className={content_area.content}>
      
      <MyPosts />
    </div>
  )
}

export default Profile;