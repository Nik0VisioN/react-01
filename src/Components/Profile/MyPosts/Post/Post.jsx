import React from 'react';
import content_area from './Post.module.css';

const Post = (props) => {
  return (
    <div className={content_area.post}>
      <div className={content_area.header}>
        <img
          src='https://cdn-icons-png.flaticon.com/512/149/149071.png'
          alt='avatar'
          className={content_area.avatar}
        />
        <span className={content_area.nickname}>nickname</span>
      </div>
      <div className={content_area.message}>
        {props.message}
      </div>
      <div className={content_area.likes} onClick={() => props.toggleLike(props.id)} style={{ cursor: 'pointer' }}>
        <span className={content_area.heart} style={{ color: props.liked ? '#e74c3c' : '#888' }}>
          {props.liked ? '♥' : '♡'}
        </span>
        {props.likesCount}
      </div>
    </div>
  )
}
export default Post;