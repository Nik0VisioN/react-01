import React from 'react';
import content_area from './MyPosts.module.css';
import Post from './Post/Post';

const MyPosts = () => {

let postsData = [
      { id: 1, message: 'Hello, world!', likesCount: 15 },
      { id: 2, message: 'How are you?', likesCount: 20 },
      { id: 3, message: 'This is my first post!', likesCount: 30 },
      { id: 4, message: 'Hi', likesCount: 25 },
      { id: 5, message: 'Yo', likesCount: 10 },
      { id: 6, message: 'Hi', likesCount: 5 }
    ];

  return (<>
    <div>
      <textarea></textarea>
      <button> Add post </button>
      <button> Remove</button>
    </div>
    <div className={content_area.posts}>
      <Post message={postsData[0].message} likesCount={postsData[0].likesCount} />
      <Post message={postsData[1].message} likesCount={postsData[1].likesCount} />
      <Post message={postsData[2].message} likesCount={postsData[2].likesCount} />
      <Post message={postsData[3].message} likesCount={postsData[3].likesCount} />
      <Post message={postsData[4].message} likesCount={postsData[4].likesCount} />
    </div>
  </>
  )
}

export default MyPosts;