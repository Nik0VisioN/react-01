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

  const dispatch = useDispatch();

  useEffect(() => {
    if (!profileId) return;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, status, city, country, photo_url, cover_url, bio, age, created_at, last_seen')
        .eq('id', profileId)
        .single();   // .single() returns single object instead of array, so we don't need data[0] later

      if (error) {
        console.error('Profile load error:', error);
        return;
      }

      setLastSeen(data.last_seen);

      // count: subscribers, followers, posts - we can do in one query with .select('*', { count: 'exact', head: true }) and then check count in response
      const [{ count: followers }, { count: following }, { count: posts }] = await Promise.all([
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', profileId),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', profileId),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('profile_id', profileId),
      ]);

      // date registration -> "Joined Jan 2020"
      const joined = data.created_at
        ? new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : '';

      //move Supabase-datesTable -> userInfo, which is used in ProfileInfo component
      dispatch(setUserInfoActionCreator({
        name: data.name,
        title: data.status || '',
        location: [data.city, data.country].filter(Boolean).join(', '),
        photo: data.photo_url,
        cover: data.cover_url,
        bio: data.bio,
        age: data.age,
        joined,
        followers: followers ?? 0,
        following: following ?? 0,
        posts: posts ?? 0,
      }));
    };

    loadProfile();
  }, [profileId, dispatch]);

  // if profile is offline, then load last_seen and show "Last seen: date" in profile info
  useEffect(() => {
    if (!profileId || isOnline) return;
    let active = true;
    supabase.from('profiles').select('last_seen').eq('id', profileId).single()
      .then(({ data }) => { if (active && data) setLastSeen(data.last_seen); });
    return () => { active = false; };
  }, [isOnline, profileId]);


  // wait when AuthContext make right session
  if (loading) return <div>Loading...</div>;
  if (!profileId) return <Navigate to="/users" replace />;

  return (
    <div className={content_area.profile}>
      <ProfileInfo isOwnProfile={isOwnProfile} isOnline={isOnline} lastSeen={lastSeen} />
      <MyPostsContainer profileId={profileId} />
    </div>
  );
};

export default Profile;