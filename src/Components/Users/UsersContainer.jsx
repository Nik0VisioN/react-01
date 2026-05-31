import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { followActionCreator, unfollowActionCreator, setUsersActionCreator } from '../../Redux/users_reducer';
import Users from './Users';
import { supabase } from '../../supabaseClient';

const UsersContainer = () => {
    const dispatch = useDispatch();
    const users = useSelector(state => state.usersPage.usersData);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setCurrentUserId(user?.id);
        });
    }, []);

    useEffect(() => {
        if (!currentUserId) return;

        const loadUsers = async () => {
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*');

            if (profilesError) {
                console.error('Error loading profiles:', profilesError);
                return;
            }

            // кого я добавил (я → он)
            const { data: following, error: followingError } = await supabase
                .from('follows')
                .select('following_id')
                .eq('follower_id', currentUserId);

            // кто добавил меня (он → я)
            const { data: followers, error: followersError } = await supabase
                .from('follows')
                .select('follower_id')
                .eq('following_id', currentUserId);

            if (followingError || followersError) {
                console.error('Error loading follows:', followingError || followersError);
                return;
            }

            const followingSet = new Set((following || []).map(f => f.following_id)); // i -> he
            const followerSet = new Set((followers || []).map(f => f.follower_id));   // he - > me

            const formatted = profiles
                .filter(p => p.id !== currentUserId)
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    status: p.status,
                    photoUrl: p.photo_url,
                    followed: followingSet.has(p.id),     // iFollow
                    theyFollow: followerSet.has(p.id),    // we are friends if both follow each other
                    location: { city: p.city, country: p.country },
                }));

            dispatch(setUsersActionCreator(formatted));
        };

        loadUsers();
    }, [dispatch, currentUserId]);

    const follow = async (userId) => {
        const { error } = await supabase.from('follows')
            .insert({ follower_id: currentUserId, following_id: userId });
        if (error) { console.error('Follow error:', error); return; }
        dispatch(followActionCreator(userId));
    };

    const unfollow = async (userId) => {
        const { error } = await supabase.from('follows')
            .delete()
            .eq('follower_id', currentUserId)
            .eq('following_id', userId);
        if (error) { console.error('Unfollow error:', error); return; }
        dispatch(unfollowActionCreator(userId));
    };

    return <Users users={users} follow={follow} unfollow={unfollow} />;
};

export default UsersContainer;