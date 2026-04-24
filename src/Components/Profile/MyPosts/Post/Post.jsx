import React from 'react';
import content_area from './Post.module.css';

const Post = (props) => {

  return (

    <div className={content_area.posts}>
      <img src='https://cdn-icons-png.flaticon.com/512/149/149071.png' alt='avatar' className={content_area.avatar} />
      <span>nickname</span>
      <div>
      {props.message}
      </div>
      <div>
      <span> like </span> {props.likesCount} 
      </div>
    </div>
  )
}

export default Post;