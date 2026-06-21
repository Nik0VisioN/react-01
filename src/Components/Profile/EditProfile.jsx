import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import s from './EditProfile.module.css';

const BUCKET = 'Avatars_media';

const EditProfile = () => {
    const { session, loading: authLoading } = useAuth();
    const userId = session?.user?.id;

    const [username, setUsername] = useState('');
    const [usernameStatus, setUsernameStatus] = useState(''); // '', 'checking', 'available', 'taken', 'invalid'
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [bio, setBio] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [locationVisible, setLocationVisible] = useState(true);
    const [showLastSeen, setShowLastSeen] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [uploads, setUploads] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [coverUploading, setCoverUploading] = useState(false);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);

    // list user's uploaded files (for the gallery / cleanup)
    const loadUploads = useCallback(async () => {
        if (!userId) return;
        const { data, error } = await supabase.storage.from(BUCKET).list(userId, {
            sortBy: { column: 'created_at', order: 'desc' },
        });
        if (error) return;
        const files = (data || [])
            .filter(f => f.id)
            .map(f => ({
                name: f.name,
                url: supabase.storage.from(BUCKET).getPublicUrl(`${userId}/${f.name}`).data.publicUrl,
            }));
        setUploads(files);
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        const load = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('name, username, photo_url, cover_url, city, country, location_visible, show_last_seen')
                .eq('id', userId)
                .single();

            if (error) { setError(error.message); }
            else if (data) {
                setName(data.name ?? '');
                setUsername(data.username ?? '');
                setCity(data.city ?? '');
                setCountry(data.country ?? '');
                setLocationVisible(data.location_visible ?? true);
                setShowLastSeen(data.show_last_seen ?? true);
                setAvatarUrl(data.photo_url ?? '');
                setCoverUrl(data.cover_url ?? '');
            }

            // private fields (bio, age) live in profiles_private
            const { data: priv } = await supabase
                .from('profiles_private')
                .select('bio, age')
                .eq('id', userId)
                .maybeSingle();
            setBio(priv?.bio ?? '');
            setAge(priv?.age ?? '');

            setLoading(false);
            loadUploads();
        };
        load();
    }, [userId, loadUploads]);

    // live username availability check (debounced)
    useEffect(() => {
        if (!userId) return;
        const value = username.trim().toLowerCase();

        if (!value) { setUsernameStatus(''); return; }
        if (!/^[a-z0-9_]{3,20}$/.test(value)) { setUsernameStatus('invalid'); return; }

        setUsernameStatus('checking');
        const t = setTimeout(async () => {
            // exclude my own row so my current username reads as available
            const { data } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', value)
                .neq('id', userId)
                .maybeSingle();
            setUsernameStatus(data ? 'taken' : 'available');
        }, 400);

        return () => clearTimeout(t);
    }, [username, userId]);

    // upload an image to <userId>/ and return its public URL
    const uploadImage = async (file, kind) => {
        const ext = file.name.split('.').pop();
        const path = `${userId}/${kind}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
            .from(BUCKET)
            .upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        return data.publicUrl;
    };

    const handleAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setError(''); setSaved(false); setAvatarUploading(true);
        try {
            const url = await uploadImage(file, 'avatar');
            setAvatarUrl(url);
            loadUploads();
        } catch (err) {
            setError('Avatar upload failed: ' + err.message);
        } finally {
            setAvatarUploading(false);
        }
    };

    const handleCover = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setError(''); setSaved(false); setCoverUploading(true);
        try {
            const url = await uploadImage(file, 'cover');
            setCoverUrl(url);
            loadUploads();
        } catch (err) {
            setError('Cover upload failed: ' + err.message);
        } finally {
            setCoverUploading(false);
        }
    };

    const applyAsAvatar = (url) => { setAvatarUrl(url); setSaved(false); };
    const applyAsCover = (url) => { setCoverUrl(url); setSaved(false); };

    const deleteUpload = async (fileName) => {
        const path = `${userId}/${fileName}`;
        const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

        const { error } = await supabase.storage.from(BUCKET).remove([path]);
        if (error) { setError('Delete failed: ' + error.message); return; }

        // if the deleted file was the current avatar/cover, clear it
        if (url === avatarUrl) setAvatarUrl('');
        if (url === coverUrl) setCoverUrl('');
        loadUploads();
    };

    const handleSave = async () => {
        setError(''); setSaved(false);
        if (!name.trim()) { setError('Name cannot be empty'); return; }

        const uname = username.trim().toLowerCase();
        if (!/^[a-z0-9_]{3,20}$/.test(uname)) {
            setError('Username must be 3–20 chars: a–z, 0–9, _');
            return;
        }
        if (usernameStatus === 'taken') { setError('Username is already taken'); return; }

        let ageValue = null;
        if (age !== '' && age !== null) {
            ageValue = Number(age);
            if (Number.isNaN(ageValue) || ageValue < 13 || ageValue > 120) {
                setError('Age must be a number between 13 and 120');
                return;
            }
        }

        setSaving(true);

        // public fields → profiles
        const { error: pubErr } = await supabase
            .from('profiles')
            .update({
                name: name.trim(),
                username: uname,
                city: city.trim() || null,
                country: country.trim() || null,
                location_visible: locationVisible,
                show_last_seen: showLastSeen,
                photo_url: avatarUrl || null,
                cover_url: coverUrl || null,
            })
            .eq('id', userId);

        // private fields → profiles_private
        const { error: privErr } = await supabase
            .from('profiles_private')
            .upsert({ id: userId, bio: bio.trim() || null, age: ageValue }, { onConflict: 'id' });

        setSaving(false);

        if (pubErr) {
            // 23505 = unique violation (taken), 23514 = check violation (bad format)
            if (pubErr.code === '23505') { setError('Username is already taken'); return; }
            if (pubErr.code === '23514') { setError('Username format is invalid'); return; }
            setError(pubErr.message);
            return;
        }
        if (privErr) { setError(privErr.message); return; }
        setSaved(true);
    };

    return (
        <div className={s.page}>
            <div className={s.glow}></div>

            <div className={s.card}>
                <Link to="/profile" className={s.backLink}>← Back to profile</Link>

                <div className={s.header}>
                    <h2 className={s.title}>Edit profile</h2>
                    <p className={s.subtitle}>Update how others see you</p>
                </div>

                {authLoading ? (
                    <p className={s.muted}>Loading...</p>
                ) : !userId ? (
                    <p className={s.muted}>Please sign in to edit your profile.</p>
                ) : loading ? (
                    <p className={s.muted}>Loading...</p>
                ) : (
                    <div className={s.form}>
                        <div className={s.field}>
                            <label className={s.label}>Cover image</label>
                            <div
                                className={s.coverPreview}
                                style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
                            >
                                <label className={s.imgBtn}>
                                    {coverUploading ? 'Uploading...' : 'Change cover'}
                                    <input type="file" accept="image/*" hidden onChange={handleCover} disabled={coverUploading} />
                                </label>
                            </div>
                        </div>

                        <div className={s.field}>
                            <label className={s.label}>Avatar</label>
                            <div className={s.avatarRow}>
                                <div className={s.avatarPreview}>
                                    {avatarUrl
                                        ? <img src={avatarUrl} alt="avatar" />
                                        : (name ? name[0].toUpperCase() : '?')}
                                </div>
                                <label className={s.imgBtnSolid}>
                                    {avatarUploading ? 'Uploading...' : 'Change avatar'}
                                    <input type="file" accept="image/*" hidden onChange={handleAvatar} disabled={avatarUploading} />
                                </label>
                            </div>
                        </div>

                        {/* uploaded files gallery */}
                        {uploads.length > 0 && (
                            <div className={s.field}>
                                <label className={s.label}>Your uploads</label>
                                <div className={s.gallery}>
                                    {uploads.map(u => (
                                        <div className={s.thumb} key={u.name}>
                                            <img src={u.url} alt="" />

                                            {u.url === avatarUrl && <span className={s.thumbTag}>Avatar</span>}
                                            {u.url === coverUrl && <span className={s.thumbTag}>Cover</span>}

                                            <div className={s.thumbActions}>
                                                <button onClick={() => applyAsAvatar(u.url)} title="Set as avatar" aria-label="Set as avatar">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                </button>
                                                <button onClick={() => applyAsCover(u.url)} title="Set as cover" aria-label="Set as cover">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                                                </button>
                                                <button onClick={() => deleteUpload(u.name)} title="Delete" aria-label="Delete image">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className={s.galleryHint}>Old photos stay here until you delete them.</p>
                            </div>
                        )}

                        <div className={s.field}>
                            <label className={s.label}>Name</label>
                            <input className={s.input} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                        </div>

                        {/* Username */}
                        <div className={s.field}>
                            <label className={s.label}>Username</label>
                            <div className={s.usernameWrap}>
                                <span className={s.usernameAt}>@</span>
                                <input
                                    className={s.input}
                                    value={username}
                                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                    placeholder="your_handle"
                                    maxLength={20}
                                />
                            </div>
                            {usernameStatus === 'checking' && <span className={s.hintMuted}>Checking…</span>}
                            {usernameStatus === 'available' && <span className={s.hintOk}>✓ Available</span>}
                            {usernameStatus === 'taken' && <span className={s.hintBad}>✕ Already taken</span>}
                            {usernameStatus === 'invalid' && <span className={s.hintBad}>3–20 chars: a–z, 0–9, _</span>}
                        </div>

                        <div className={s.field}>
                            <label className={s.label}>Age</label>
                            <input
                                className={s.input}
                                type="number"
                                min="13"
                                max="120"
                                value={age}
                                onChange={e => setAge(e.target.value)}
                                onWheel={(e) => e.currentTarget.blur()}   // prevent mouse wheel from changing the value
                                placeholder="Your age"
                            />
                        </div>

                        {/* Location */}
                        <div className={s.field}>
                            <label className={s.label}>Location</label>
                            <div className={s.locationRow}>
                                <input className={s.input} value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
                                <input className={s.input} value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" />
                            </div>

                            <label className={s.toggleRow}>
                                <span className={s.toggleText}>
                                    Show location on my profile
                                    <span className={s.toggleHint}>When off, only you can see it.</span>
                                </span>
                                <input
                                    type="checkbox"
                                    className={s.toggleInput}
                                    checked={locationVisible}
                                    onChange={e => setLocationVisible(e.target.checked)}
                                />
                                <span className={s.toggleTrack}></span>
                            </label>
                        </div>

                        <div className={s.field}>
                            <label className={s.label}>Privacy</label>
                            <label className={s.toggleRow}>
                                <span className={s.toggleText}>
                                    Show my last seen
                                    <span className={s.toggleHint}>When off, others won't see how long ago you were online.</span>
                                </span>
                                <input
                                    type="checkbox"
                                    className={s.toggleInput}
                                    checked={showLastSeen}
                                    onChange={e => setShowLastSeen(e.target.checked)}
                                />
                                <span className={s.toggleTrack}></span>
                            </label>
                        </div>

                        <div className={s.field}>
                            <label className={s.label}>Bio</label>
                            <textarea className={s.textarea} value={bio} onChange={e => setBio(e.target.value)} placeholder="A few words about you" maxLength={160} />
                        </div>

                        {error && <div className={s.error}>{error}</div>}
                        {saved && <div className={s.success}>Saved!</div>}

                        <button className={s.submit} onClick={handleSave} disabled={saving || avatarUploading || coverUploading}>
                            <span>{saving ? 'Saving...' : 'Save changes'}</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditProfile;