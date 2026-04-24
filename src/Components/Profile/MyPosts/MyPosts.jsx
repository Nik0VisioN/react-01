import React from 'react';
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
      <Post message="Hello, world!" likesCount='4' />
      <Post message="This is my first post!" likesCount='66' />
    </div>
  </>
  )
}

export default MyPosts;