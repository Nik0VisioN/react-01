import React from 'react';
import content_area from './MyPosts.module.css';
import Post from './Post/Post';
import { postsData } from '../../../index';

const MyPosts = () => {

let postsElements = postsData.map(post => <Post message={post.message} likesCount={post.likesCount} />);


  return (<>
    <div>
      <textarea></textarea>
      <button> Add post </button>
      <button> Remove</button>
    </div>
    <div className={content_area.posts}>
      {postsElements}
    </div>
  </>
  )
}

export default MyPosts;