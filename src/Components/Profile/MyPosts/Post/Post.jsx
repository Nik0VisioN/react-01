import React from 'react';
import s from './Post.module.css';

const Post = (props) => {
  const {
    id,
    message,
    authorName,
    authorPhoto,
    userId,
    currentUserId,
    profileOwnerId,
    liked,
    likesCount,
    toggleLike,
    deletePost,
  } = props;

  const canDelete =
    currentUserId &&
    (currentUserId === userId || currentUserId === profileOwnerId);


  return (
    <div className={s.post}>
      <div className={s.header}>
        <div className={s.avatar}>
          {authorPhoto                                       // photo_url by author, if we have it, show it, otherwise show first letter of name or '?' if no name
            ? <img src={authorPhoto} alt={authorName} />
            : (authorName ? authorName[0].toUpperCase() : '?')}
        </div>
        <span className={s.nickname}>{authorName || 'Unknown'}</span>

        {canDelete && (
          <button
            className={s.deleteBtn}
            onClick={() => deletePost(id)}
            aria-label="Delete post"
            title="Delete post"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <div className={s.message}>
        {message}
      </div>

      <button className={s.likes} onClick={() => toggleLike(id)}>
        <span className={s.heart} style={{ color: liked ? '#e74c3c' : 'inherit' }}>
          {liked ? '♥' : '♡'}
        </span>
        {likesCount}
      </button>
    </div>
  );
};


export default Post;