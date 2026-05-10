import React from 'react';
import content_area from './MyPosts.module.css';
import Post from './Post/Post';


const MyPosts = (props) => {

let postsElements = props.posts.map(post => <Post message={post.message} likesCount={post.likesCount} />);

let newPostElement = React.createRef();

let addPost = () => {
  let text = newPostElement.current.value;
  //props.addPost(text);
  alert(text);
}

  return (
  <div className={content_area.my_posts}>
    <div className={content_area.editor}>
      <textarea placeholder="Напиши что-нибудь..." ref={newPostElement}></textarea>
      <div className={content_area.buttons}>
        <button onClick={addPost} className={content_area.btn_add}>Add post</button>
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