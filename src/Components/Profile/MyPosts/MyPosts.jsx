import React from 'react';
import content_area from './MyPosts.module.css';
import Post from './Post/Post';

const MyPosts = (props) => {

  const postsElements = props.posts.map(post => (
    <Post
      key={post.id}
      id={post.id}
      message={post.message}
      authorName={post.authorName}
      authorPhoto={post.authorPhoto}
      authorUsername={post.authorUsername}
      userId={post.userId}
      currentUserId={props.currentUserId}
      profileOwnerId={props.profileOwnerId}
      liked={post.liked}
      likesCount={post.likesCount}
      toggleLike={props.toggleLike}
      deletePost={props.deletePost}
    />
  ));

  const newPostElement = React.createRef();
  const onAddPost = () => props.addPost();
  const clearTextarea = () => props.updateNewPostText('');
  const onPostChange = () => {
    const text = newPostElement.current.value;
    props.updateNewPostText(text);
  };

  return (
    <div className={content_area.my_posts}>
      <div className={content_area.editor}>
        <textarea
          onChange={onPostChange}
          ref={newPostElement}
          value={props.newPostText}
          placeholder='Write your text '
        />
        <div className={content_area.buttons}>
          <button onClick={onAddPost} className={content_area.btn_add}>Add post</button>
          <button onClick={clearTextarea} className={content_area.btn_remove} disabled={!props.newPostText}>Remove</button>
        </div>
      </div>
      <div className={content_area.posts}>
        {postsElements}
      </div>
    </div>
  );
};

export default MyPosts;