import React from 'react';
import content_area from './MyPosts.module.css';
import Post from './Post/Post';


const MyPosts = (props) => {

  let postsElements = props.posts.map(post => <Post key={post.id} id={post.id} message={post.message} likesCount={post.likesCount} liked={post.liked} toggleLike={props.toggleLike} />);

  let newPostElement = React.createRef();

  let onAddPost = () => {
    props.addPost();
  }

  let removeNewPost = () => {
    props.removePost();
  }


  let onPostChange = () => {
    let text = newPostElement.current.value;
    props.updateNewPostText(text)
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
          <button onClick={onAddPost} className={content_area.btn_add}>Add post</button>
          <button onClick={removeNewPost} className={content_area.btn_remove}>Remove</button>
        </div>
      </div>
      <div className={content_area.posts}>
        {postsElements}
      </div>
    </div>
  )
}

export default MyPosts;