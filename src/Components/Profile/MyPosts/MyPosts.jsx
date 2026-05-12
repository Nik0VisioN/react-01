import React from 'react';
import content_area from './MyPosts.module.css';
import Post from './Post/Post';
import { addPostActionCreator, updateNewPostTextActionCreator } from '../../../Redux/state';
import { removePostActionCreator } from '../../../Redux/state';


const MyPosts = (props) => {

  let postsElements = props.posts.map(post => <Post message={post.message} likesCount={post.likesCount} />);

  let newPostElement = React.createRef();

  let addPost = () => {
    props.dispatch(addPostActionCreator());
  }

  let removePost = () => {
    props.dispatch(removePostActionCreator());
  }


  let onPostChange = () => {
    let text = newPostElement.current.value;
    let action = updateNewPostTextActionCreator(text);
    props.dispatch(action);
  }

  return (
    <div className={content_area.my_posts}>
      <div className={content_area.editor}>
        <textarea
          onChange={onPostChange}
          ref={newPostElement}
          value={props.newPostText}
          placeholder='Write your text ' />

        <div className={content_area.buttons}>
          <button onClick={addPost} className={content_area.btn_add}>Add post</button>
          <button onClick={removePost} className={content_area.btn_remove}>Remove</button>
        </div>
      </div>
      <div className={content_area.posts}>
        {postsElements}
      </div>
    </div>
  )
}

export default MyPosts;