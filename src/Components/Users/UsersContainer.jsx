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
        if (!currentUserId) return;     //wait until we know current user ID to load users list

        const loadUsers = async () => {
            // Load all profiles(except current user)
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*');

            if (profilesError) {
                console.error('Error loading profiles:', profilesError);
                return;
            }

            // Load follows for current user to determine who is followed
            const { data: follows, error: followsError } = await supabase
                .from('follows')
                .select('following_id')
                .eq('follower_id', currentUserId);

            if (followsError) {
                console.error('Error loading follows:', followsError);
                return;
            }

            // make Set of following IDs for quick lookup
            const followingSet = new Set(follows.map(f => f.following_id));

            // make massive of users with "followed" field
            const formatted = profiles
                .filter(p => p.id !== currentUserId)   // don't show current user in the list
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    status: p.status,
                    photoUrl: p.photo_url,
                    followed: followingSet.has(p.id),
                    location: {
                        city: p.city,
                        country: p.country
                    }
                }));

            dispatch(setUsersActionCreator(formatted));
        };

        loadUsers();
    }, [dispatch, currentUserId]);

    const follow = async (userId) => {
        await supabase.from('follows').insert({
            follower_id: currentUserId,
            following_id: userId
        });
        dispatch(followActionCreator(userId));   // reload UI
    };

    const unfollow = async (userId) => {
        await supabase.from('follows')
            .delete()
            .eq('follower_id', currentUserId)
            .eq('following_id', userId);
        dispatch(unfollowActionCreator(userId));
    };

    return <Users
        users={users}
        follow={follow}
        unfollow={unfollow}
    />;
}

export default UsersContainer;