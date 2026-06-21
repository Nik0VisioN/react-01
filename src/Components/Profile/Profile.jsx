import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import content_area from './Profile.module.css';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import MyPostsContainer from './MyPosts/MyPostsContainer';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { usePresence } from '../Auth/PresenceContext';
import { setUserInfoActionCreator } from '../../Redux/profile_reducer';

// matches a UUID so we can keep old /profile/<uuid> links working
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const Profile = () => {
  const { username: urlParam } = useParams();
  const { session, loading } = useAuth();
  const currentUserId = session?.user?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // resolve the URL param (username or legacy uuid) into a profile id
  const [profileId, setProfileId] = useState(null);
  const [resolving, setResolving] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    const resolve = async () => {
      setResolving(true);
      setNotFound(false);

      // own profile at /profile → redirect to /profile/<my username>
      if (!urlParam) {
        if (!currentUserId) { if (active) { setProfileId(null); setResolving(false); } return; }
        const { data } = await supabase
          .from('profiles').select('username').eq('id', currentUserId).maybeSingle();
        if (!active) return;
        if (data?.username) { navigate(`/profile/${data.username}`, { replace: true }); return; }
        setProfileId(currentUserId); // fallback if username is somehow missing
        setResolving(false);
        return;
      }

      // legacy uuid link → use it directly (keeps old links alive)
      if (UUID_RE.test(urlParam)) {
        if (active) { setProfileId(urlParam); setResolving(false); }
        return;
      }

      // username → id
      const { data } = await supabase
        .from('profiles').select('id').eq('username', urlParam.toLowerCase()).maybeSingle();
      if (!active) return;
      if (data) setProfileId(data.id);
      else { setProfileId(null); setNotFound(true); }
      setResolving(false);
    };
    resolve();
    return () => { active = false; };
  }, [urlParam, currentUserId, navigate]);

  const isOwnProfile = !!currentUserId && profileId === currentUserId;

  const { onlineIds } = usePresence();
  const isOnline = profileId ? onlineIds.has(profileId) : false;

  const [lastSeen, setLastSeen] = useState(null);
  const [iFollow, setIFollow] = useState(false);      // i follow them
  const [theyFollow, setTheyFollow] = useState(false); // they follow me
  const [relLoading, setRelLoading] = useState(true);

  // load profile data + counts (reused by initial load and realtime)
  const loadProfile = useCallback(async () => {
    if (!profileId) return;

    const { data: pub, error } = await supabase
      .from('profiles')
      .select('id, name, status, city, country, photo_url, cover_url, created_at, location_visible, show_last_seen')
      .eq('id', profileId)
      .single();

    if (error) { console.error('Profile load error:', error); return; }

    // private fields: only for owner or mutual friend, otherwise null
    const { data: priv } = await supabase
      .from('profiles_private')
      .select('bio, age, last_seen')
      .eq('id', profileId)
      .maybeSingle();

    setLastSeen(priv?.last_seen ?? null);

    const [{ count: followers }, { count: following }, { count: posts }] = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', profileId),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', profileId),
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('profile_id', profileId),
    ]);

    const joined = pub.created_at
      ? new Date(pub.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : '';

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
  }, [profileId, dispatch]);

  // load relationship for the friend button and content gate
  const loadRel = useCallback(async () => {
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
    setIFollow(!!mine);
    setTheyFollow(!!theirs);
    setRelLoading(false);
  }, [profileId, currentUserId, isOwnProfile]);

  useEffect(() => { loadProfile(); }, [loadProfile]);
  useEffect(() => { loadRel(); }, [loadRel]);

  // if offline, pull last_seen to show "Last seen X ago"
  useEffect(() => {
    if (!profileId || isOnline) return;
    let active = true;
    supabase.from('profiles_private').select('last_seen').eq('id', profileId).maybeSingle()
      .then(({ data }) => { if (active && data) setLastSeen(data.last_seen); });
    return () => { active = false; };
  }, [isOnline, profileId]);

  // realtime: keep friend status and counts fresh
  useEffect(() => {
    if (!profileId) return;
    const channel = supabase
      .channel(`profile-${profileId}-${currentUserId || 'anon'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'follows' }, (payload) => {
        const r = payload.new || payload.old || {};
        const involvesPair = currentUserId && (
          (r.follower_id === currentUserId && r.following_id === profileId) ||
          (r.follower_id === profileId && r.following_id === currentUserId)
        );
        const involvesProfile = r.follower_id === profileId || r.following_id === profileId;
        if (involvesPair) loadRel();
        if (involvesProfile) loadProfile();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts', filter: `profile_id=eq.${profileId}` }, () => loadProfile())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [profileId, currentUserId, loadProfile, loadRel]);

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

  // friendship state: 'none' / 'friends' (mutual) / 'requested' (i follow, they don't) / 'incoming' (they follow, i don't)
  let friendState = 'none';
  if (iFollow && theyFollow) friendState = 'friends';
  else if (iFollow) friendState = 'requested';
  else if (theyFollow) friendState = 'incoming';

  const isFriends = iFollow && theyFollow;
  const canSeeContent = isOwnProfile || isFriends;

  if (loading || resolving) return <div>Loading...</div>;
  if (!urlParam && !currentUserId) return <Navigate to="/login" replace />;
  if (notFound) {
    return (
      <div className={content_area.locked}>
        <span className={content_area.lockedTitle}>User not found</span>
        <span>This profile doesn’t exist.</span>
      </div>
    );
  }
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