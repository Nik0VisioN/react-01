import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import content_area from './Profile.module.css';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import MyPostsContainer from './MyPosts/MyPostsContainer';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { setUserInfoActionCreator } from '../../Redux/profile_reducer';

const Profile = () => {
  const { userId: urlUserId } = useParams();
  const { session, loading  } = useAuth();
  const currentUserId = session?.user?.id;

  // if URL is empty, show current user's profile
  const profileId = urlUserId || currentUserId;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!profileId) return;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, status, city, country, photo_url')
        .eq('id', profileId)
        .single();   // .single() returns single object instead of array, so we don't need data[0] later

      if (error) {
        console.error('Profile load error:', error);
        return;
      }

      //move Supabase-datesTable -> userInfo, which is used in ProfileInfo component
      dispatch(setUserInfoActionCreator({
        name: data.name,
        title: data.status || '',
        location: [data.city, data.country].filter(Boolean).join(', '),
        photo: data.photo_url
      }));
    };

    loadProfile();
  }, [profileId, dispatch]);

  // wait when AuthContext make right session
  if (loading) return <div>Loading...</div>;

  if (!profileId) return <Navigate to="/users" replace />;

  return (
    <div className={content_area.profile}>
      <ProfileInfo />
      <MyPostsContainer profileId={profileId} />
    </div>
  );
};

export default Profile;