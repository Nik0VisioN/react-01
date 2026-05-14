import React from 'react';
import { addPostActionCreator, updateNewPostTextActionCreator, removePostActionCreator } from '../../../Redux/profile_reducer';
import MyPosts from './MyPosts';



const MyPostsContainer = (props) => {
  let state = props.store.getState();

  let addPost = () => {
    //props.addPost();
    props.store.dispatch(addPostActionCreator());
  }

  let removePost = () => {
    //props.removePost();
    props.store.dispatch(removePostActionCreator());
  }


  let onPostChange = (text) => {
    let action = updateNewPostTextActionCreator(text);
    props.store.dispatch(action);
  }

  return (<MyPosts 
    updateNewPostText = {onPostChange} 
    addPost = {addPost} 
    removePost = {removePost}
    posts = {state.profilePage.postsData}
    newPostText = {state.profilePage.newPostText}
    />)
}

export default MyPostsContainer;