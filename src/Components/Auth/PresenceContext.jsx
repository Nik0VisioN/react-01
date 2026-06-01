import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';

const PresenceContext = createContext({ onlineIds: new Set() });
export const usePresence = () => useContext(PresenceContext); // take Online with anyone element, which is more convenient than passing isOnline from Profile to ProfileInfo

export const PresenceProvider = ({ children }) => {
  const { session } = useAuth();
  const userId = session?.user?.id; // take user id from auth context to know which user is online (to track presence) and which profile is online (to show it in profile info)

  const [onlineIds, setOnlineIds] = useState(new Set()); // state online ids, which is updated on every presence sync (join/leave) and contains all online ids, so we can check if specific id is online with onlineIds.has(id)

  useEffect(() => { // if no user id (not logged in), then clear online ids and don't subscribe to presence
    if (!userId) {
      setOnlineIds(new Set());
      return;
    }

    // heartbeat: keep last_seen fresh while the app is open
    const ping = () =>
      supabase.from('profiles_private')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', userId);

    ping();
    const interval = setInterval(ping, 45000); // update every 45 seconds, because Supabase considers user offline if last_seen is older than 1.5 minutes, so 45 seconds is a good value to keep it fresh without too many requests

    // fix time, when user closes tab or browser and onVisibilityChange doesn't fire (which should update last_seen and remove user from online list), so we track pagehide event in addition to visibilitychange, which works better for this case
    const onVisibility = () => ping();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onVisibility);

    // presence key = user id, so presenceState() keys = all online ids
    const channel = supabase.channel('online-users', {
      config: { presence: { key: userId } },
    });
    channel
      .on('presence', { event: 'sync' }, () => {
        setOnlineIds(new Set(Object.keys(channel.presenceState())));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // show "Online" immediately after login, without waiting for next presence sync (which happens on every join/leave)
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onVisibility);
      ping();
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <PresenceContext.Provider value={{ onlineIds }}>
      {children}
    </PresenceContext.Provider>
  );
};