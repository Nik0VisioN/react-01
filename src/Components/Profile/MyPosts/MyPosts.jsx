import React from 'react';
import content_area from './MyPosts.module.css';
import Post from './Post/Post';


const MyPosts = (props) => {

let postsElements = props.posts.map(post => <Post message={post.message} likesCount={post.likesCount} />);


  return (
  <div className={content_area.my_posts}>
    <div className={content_area.editor}>
      <textarea placeholder="Напиши что-нибудь..."></textarea>
      <div className={content_area.buttons}>
        <button className={content_area.btn_add}>Add post</button>
        <button className={content_area.btn_remove}>Remove</button>
      </div>
    </div>
    <div className={content_area.posts}>
      {postsElements}
    </div>
  </div>
)
}

export default MyPosts;