import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateNewPostTextActionCreator,
  removePostActionCreator,
  toggleLikeActionCreator,
  setPostsActionCreator
} from '../../../Redux/profile_reducer';
import MyPosts from './MyPosts';
import { supabase } from '../../../supabaseClient';
import { useAuth } from '../../../AuthContext';
import LoginRequired from '../../Auth/LoginRequired';

const MyPostsContainer = ({ profileId }) => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.profilePage.postsData);
  const newPostText = useSelector(state => state.profilePage.newPostText);
  const { session } = useAuth();
  const currentUserId = session?.user?.id;
  const profileOwnerId = profileId;

  const [showLogin, setShowLogin] = useState(false);

  // live ref to current posts so the realtime handler avoids a stale closure
  const postsRef = useRef(posts);
  useEffect(() => { postsRef.current = posts; }, [posts]);

  // single loader for posts + likes, reused by both initial load and realtime
  const loadData = useCallback(async () => {
    if (!profileId) return;

    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('id, message, user_id, profile_id, created_at, author:profiles!user_id ( id, name, photo_url, username  )')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      return;
    }
    if (!postsData) return;

    // count likes for the loaded posts in a single query (no per-post requests)
    const postIds = postsData.map(p => p.id);
    const { data: likesData } = await supabase
      .from('likes')
      .select('post_id, user_id')
      .in('post_id', postIds.length ? postIds : ['00000000-0000-0000-0000-000000000000']);

    const likesByPost = {};
    const userLikedPosts = new Set();
    (likesData || []).forEach(like => {
      likesByPost[like.post_id] = (likesByPost[like.post_id] || 0) + 1;
      if (like.user_id === currentUserId) userLikedPosts.add(like.post_id);
    });

    const formatted = postsData.map(p => ({
      id: p.id,
      message: p.message,
      authorName: p.author?.name || 'Unknown',
      authorPhoto: p.author?.photo_url || null,
      authorUsername: p.author?.username || null,
      userId: p.user_id,
      likesCount: likesByPost[p.id] || 0,
      liked: userLikedPosts.has(p.id)
    }));

    dispatch(setPostsActionCreator(formatted));
  }, [dispatch, currentUserId, profileId]);

  // initial load + realtime in one effect (so there is no double loading)
  useEffect(() => {
    if (!profileId) return;
    loadData();

    const channel = supabase
      .channel(`profile-posts-${profileId}`)
      // posts on this wall: a new or removed post refreshes the list
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts', filter: `profile_id=eq.${profileId}` },
        () => loadData()
      )
      // likes: refresh only when the changed like belongs to a post shown here
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'likes' },
        (payload) => {
          const pid = payload.new?.post_id || payload.old?.post_id;
          if (pid && postsRef.current.some(p => p.id === pid)) loadData();
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profileId, loadData]);

  const addPost = async () => {
    if (!currentUserId) return setShowLogin(true);
    const message = newPostText.trim();
    if (!message) return;

    const { error } = await supabase.from('posts').insert({
      message,
      likes_count: 0,
      user_id: currentUserId,
      profile_id: profileId
    });

    if (error) {
      console.error('Error creating post:', error);
      return;
    }

    dispatch(updateNewPostTextActionCreator(''));
    // no reload: the posts subscription refreshes the list automatically
  };

  const deletePost = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // can delete if current user is the author or the profile owner
    const canDelete = currentUserId === post.userId || currentUserId === profileOwnerId;
    if (!canDelete) return;

    const { data, error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .select();

    if (error) {
      console.error('Delete failed:', error);
      return;
    }
    if (!data || data.length === 0) {
      console.warn('Delete blocked by RLS — post stayed in DB');
      return;
    }

    // local removal for instant feedback; realtime also reconciles
    dispatch(removePostActionCreator(postId));
  };

  const toggleLike = async (postId) => {
    if (!currentUserId) return setShowLogin(true);

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.liked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', currentUserId);
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: currentUserId });
    }

    // optimistic local toggle; realtime reconciles the count for everyone
    dispatch(toggleLikeActionCreator(postId));
  };

  return (
    <>
      <MyPosts
        posts={posts}
        newPostText={newPostText}
        currentUserId={currentUserId}
        profileOwnerId={profileOwnerId}
        addPost={addPost}
        deletePost={deletePost}
        updateNewPostText={(text) => dispatch(updateNewPostTextActionCreator(text))}
        toggleLike={toggleLike}
      />
      <LoginRequired
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </>
  );
};

export default MyPostsContainer;