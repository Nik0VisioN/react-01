import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import content_area from './Profile.module.css';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import MyPostsContainer from './MyPosts/MyPostsContainer';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { usePresence } from '../Auth/PresenceContext';
import { setUserInfoActionCreator } from '../../Redux/profile_reducer';


const Profile = () => {
  const { userId: urlUserId } = useParams();
  const { session, loading } = useAuth();
  const currentUserId = session?.user?.id;

  // if URL is empty, show current user's profile
  const profileId = urlUserId || currentUserId;

  // check if this is own profile (show edit button only on own profile)
  const isOwnProfile = !!currentUserId && profileId === currentUserId;


  const { onlineIds } = usePresence();
  const isOnline = onlineIds.has(profileId);

  const [lastSeen, setLastSeen] = useState(null);

  const [iFollow, setIFollow] = useState(false);     // i follow him
  const [theyFollow, setTheyFollow] = useState(false); // he follows me
  const [relLoading, setRelLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!profileId) return;

    const loadProfile = async () => {
      // public profile data
      const { data: pub, error } = await supabase
        .from('profiles')
        .select('id, name, status, city, country, photo_url, cover_url, created_at, location_visible, show_last_seen')
        .eq('id', profileId)
        .single();   // .single() returns single object instead of array, so we don't need data[0] later

      if (error) {
        console.error('Profile load error:', error);
        return;
      }

      // private profile data (bio, age) - we load it separately because it's not needed for profile info and we want to avoid loading it if profile is private and we are not friends
      const { data: priv } = await supabase
        .from('profiles_private')
        .select('bio, age, last_seen')
        .eq('id', profileId)
        .maybeSingle();

      setLastSeen(priv?.last_seen ?? null);

      // count: subscribers, followers, posts - we can do in one query with .select('*', { count: 'exact', head: true }) and then check count in response
      const [{ count: followers }, { count: following }, { count: posts }] = await Promise.all([
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', profileId),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', profileId),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('profile_id', profileId),
      ]);

      // date registration -> "Joined Jan 2020"
      const joined = pub.created_at
        ? new Date(pub.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : '';

      //move Supabase-datesTable -> userInfo, which is used in ProfileInfo component
      dispatch(setUserInfoActionCreator({
        name: pub.name,
        title: pub.status || '',
        photo: pub.photo_url,
        cover: pub.cover_url,
        bio: priv?.bio,
        age: priv?.age,
        joined,
        followers: followers ?? 0,
        following: following ?? 0,
        posts: posts ?? 0,
        location: [pub.city, pub.country].filter(Boolean).join(', '),
        locationVisible: pub.location_visible,
        showLastSeen: pub.show_last_seen,
      }));
    };

    loadProfile();
  }, [profileId, dispatch]);

  // if profile is offline, load last_seen from database to show "Last seen X ago". For online profiles we show "Online", so no need to load last_seen.
  useEffect(() => {
    if (!profileId || isOnline) return;
    let active = true;
    supabase.from('profiles_private').select('last_seen').eq('id', profileId).maybeSingle()
      .then(({ data }) => { if (active && data) setLastSeen(data.last_seen); });
    return () => { active = false; };
  }, [isOnline, profileId]);

  // load relationship between current user and profile user (i follow him, he follows me) to show correct state of "Add friend" button and decide whether to show profile content (if profile is private and we are not friends, we hide content and show "This profile is private" message instead)
  useEffect(() => {
    let active = true;
    const loadRel = async () => {
      if (!profileId || !currentUserId || isOwnProfile) {
        setIFollow(false); setTheyFollow(false); setRelLoading(false);
        return;
      }
      setRelLoading(true);
      const [{ data: mine }, { data: theirs }] = await Promise.all([
        supabase.from('follows').select('follower_id')
          .eq('follower_id', currentUserId).eq('following_id', profileId).maybeSingle(),
        supabase.from('follows').select('follower_id')
          .eq('follower_id', profileId).eq('following_id', currentUserId).maybeSingle(),
      ]);
      if (!active) return;
      setIFollow(!!mine);
      setTheyFollow(!!theirs);
      setRelLoading(false);
    };
    loadRel();
    return () => { active = false; };
  }, [profileId, currentUserId, isOwnProfile]);

  const addFriend = async () => {
    if (!currentUserId) return;
    const { error } = await supabase.from('follows')
      .insert({ follower_id: currentUserId, following_id: profileId });
    if (error) { console.error('Add friend error:', error); return; }
    setIFollow(true);
  };

  const removeFriend = async () => {
    if (!currentUserId) return;
    const { error } = await supabase.from('follows').delete()
      .eq('follower_id', currentUserId).eq('following_id', profileId);
    if (error) { console.error('Remove friend error:', error); return; }
    setIFollow(false);
  };

  const onFriendClick = () => (iFollow ? removeFriend() : addFriend());

  // state of friendship: 'none' (no one follows), 'friends' (mutual follow), 'requested' (i follow, they don't), 'incoming' (they follow, i don't)
  let friendState = 'none';
  if (iFollow && theyFollow) friendState = 'friends';
  else if (iFollow) friendState = 'requested';
  else if (theyFollow) friendState = 'incoming';

  const isFriends = iFollow && theyFollow;
  const canSeeContent = isOwnProfile || isFriends;

  if (loading) return <div>Loading...</div>;
  if (!profileId) return <Navigate to="/users" replace />;

  return (
    <div className={content_area.profile}>
      <ProfileInfo
        isOwnProfile={isOwnProfile}
        isOnline={isOnline}
        lastSeen={lastSeen}
        isFriends={isFriends}
        friendState={friendState}
        friendBusy={relLoading}
        onFriendClick={currentUserId && !isOwnProfile ? onFriendClick : undefined}
      />

      {canSeeContent ? (
        <MyPostsContainer profileId={profileId} />
      ) : (
        <div className={content_area.locked}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className={content_area.lockedTitle}>This profile is private</span>
          <span>Add as a friend to see posts, bio and more.</span>
        </div>
      )}
    </div>
  );
};

export default Profile;