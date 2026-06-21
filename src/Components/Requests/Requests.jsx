import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { usePresence } from '../Auth/PresenceContext';
import s from './Requests.module.css';

const Requests = () => {
    const { session } = useAuth();
    const me = session?.user?.id;
    const { onlineIds } = usePresence();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);

    const load = useCallback(async () => {
        if (!me) return;
        setLoading(true);

        // who follow me, i.e. who added me to friends (but I haven't accepted yet)
        const { data: followers } = await supabase
            .from('follows').select('follower_id').eq('following_id', me);

        // who I follow, to check which of followers I already follow back (i.e. are already friends), because we want to show only those, who added me, but I haven't accepted yet (i.e. not friends yet), so we get all followers and filter out those, who are already followed back
        const { data: following } = await supabase
            .from('follows').select('following_id').eq('follower_id', me);

        const iFollow = new Set((following || []).map(r => r.following_id));
        // входящие = подписаны на меня, а я на них ещё нет
        const incomingIds = (followers || [])
            .map(r => r.follower_id)
            .filter(id => !iFollow.has(id));

        if (incomingIds.length === 0) {
            setRequests([]); setLoading(false); return;
        }

        const { data: profiles } = await supabase
            .from('profiles').select('id, name, status, photo_url').in('id', incomingIds);

        setRequests(profiles || []);
        setLoading(false);
    }, [me]);

    useEffect(() => { load(); }, [load]);

    const accept = async (id) => {
        if (!me) return;
        setBusyId(id);
        const { error } = await supabase.from('follows')
            .insert({ follower_id: me, following_id: id });
        setBusyId(null);
        if (error) { console.error('Accept error:', error); return; }
        setRequests(prev => prev.filter(u => u.id !== id)); // стали друзьями — убираем из входящих
    };

    const decline = async (id) => {
        if (!me) return;
        setBusyId(id);
        const { error } = await supabase.from('follows').delete()
            .eq('follower_id', id).eq('following_id', me);
        setBusyId(null);
        if (error) { console.error('Decline error:', error); return; }
        setRequests(prev => prev.filter(u => u.id !== id));
    };

    if (loading) return <div className={s.page}><p className={s.muted}>Loading…</p></div>;

    return (
        <div className={s.page}>
            <div className={s.header}>
                <h2 className={s.title}>Friend requests</h2>
                <p className={s.subtitle}>People who added you</p>
            </div>

            {requests.length === 0 ? (
                <div className={s.empty}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                    </svg>
                    <span>No pending requests</span>
                </div>
            ) : (
                <div className={s.list}>
                    {requests.map(u => {
                        const online = onlineIds.has(u.id);
                        return (
                            <div className={s.card} key={u.id}>
                                <Link to={`/profile/${u.id}`} className={s.user}>
                                    <div className={s.avatar}>
                                        {u.photo_url
                                            ? <img src={u.photo_url} alt={u.name} />
                                            : (u.name ? u.name[0].toUpperCase() : '?')}
                                        {online && <span className={s.onlineDot}></span>}
                                    </div>
                                    <div className={s.info}>
                                        <span className={s.name}>{u.name || 'Unnamed'}</span>
                                        <span className={s.status}>{u.status || 'wants to be friends'}</span>
                                    </div>
                                </Link>
                                <div className={s.actions}>
                                    <button className={s.accept} onClick={() => accept(u.id)} disabled={busyId === u.id}>Accept</button>
                                    <button className={s.decline} onClick={() => decline(u.id)} disabled={busyId === u.id}>Decline</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Requests;