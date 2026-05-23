import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPostActionCreator, updateNewPostTextActionCreator, removePostActionCreator, toggleLikeActionCreator, setPostsActionCreator } from '../../../Redux/profile_reducer';
import MyPosts from './MyPosts';
import { supabase } from '../../../supabaseClient';


const MyPostsContainer = (props) => {

  const dispatch = useDispatch();
  const posts = useSelector(state => state.profilePage.postsData);
  const newPostText = useSelector(state => state.profilePage.newPostText);


  useEffect(() => {//load posts from supabase on component mount
    const loadPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {// Format the data to match our state structure
        const formatted = data.map(p => ({
          id: p.id,
          message: p.message,
          likesCount: p.likes_count,
          liked: false
        }));
        dispatch(setPostsActionCreator(formatted));
      }
      if (error) console.error('Error loading posts:', error);
    };
    loadPosts();
  }, [dispatch]);

  return <MyPosts
    posts={posts}
    newPostText={newPostText}
    addPost={() => dispatch(addPostActionCreator())}
    removePost={() => dispatch(removePostActionCreator())}
    updateNewPostText={(text) => dispatch(updateNewPostTextActionCreator(text))}
    toggleLike={(id) => dispatch(toggleLikeActionCreator(id))}
  />;}

export default MyPostsContainer;