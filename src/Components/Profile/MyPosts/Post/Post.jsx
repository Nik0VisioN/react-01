import React, { Component } from 'react';
import content_area from './Post.module.css';

const Post = () => {
  return (
    <div className={content_area.post}>

      <div> </div>
      <span>nickname</span>
      <button> like </button>
    </div>
  )
}

export default Post;