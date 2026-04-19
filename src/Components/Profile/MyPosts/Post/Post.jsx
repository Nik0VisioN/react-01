import React, { Component } from 'react';
import content_area from './Post.module.css';

const Post = () => {
  return (

    <div className={content_area.posts}>
      <img src='https://cdn-icons-png.flaticon.com/512/149/149071.png' alt='avatar' className={content_area.avatar} />
      <span>nickname</span>
      <div>
      post 1
      </div>
      <div>
      <button> like </button>
      </div>
    </div>
  )
}

export default Post;