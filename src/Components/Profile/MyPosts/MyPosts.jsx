import React, { Component } from 'react';
import content_area from './MyPosts.module.css';
import Post from './Post/Post';

const MyPosts = () => {
  return (<>
    <div>
      <textarea></textarea>
      <button> Add post </button>
      <button> Remove</button>
    </div>
    <div className={content_area.posts}>
      <Post />
      <Post />
      <Post />
      <Post />
    </div>
  </>
  )
}

export default MyPosts;