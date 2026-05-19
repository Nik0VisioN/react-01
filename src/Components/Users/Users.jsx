import React from 'react';
import s from './Users.module.css';

let Users = (props) => {

    if (props.users.length === 0) {
        props.setUsers([
            { id: 1, photoUrl: '', followed: false, name: 'Alice', status: 'Online', location: { city: 'Dnipro', country: 'Ukraine' } },
            { id: 2, photoUrl: '', followed: true, name: 'Dmytro', status: 'Offline', location: { city: 'Oslo', country: 'Norway' } },
            { id: 3, photoUrl: '', followed: false, name: 'Charlie', status: 'Online', location: { city: 'Berlin', country: 'Germany' } },
            { id: 4, photoUrl: '', followed: true, name: 'David', status: 'Offline', location: { city: 'Bergen', country: 'Norway' } },
            { id: 5, photoUrl: '', followed: true, name: 'Sviatoslav', status: 'Online', location: { city: 'Kiev', country: 'Ukraine' } },
        ]);
    }

    return (
        props.users.map(u => <div key={u.id} className={s.user}>
            <span>
                <div className={s.avatar}>
                    {u.photoUrl // if we have a photo, show it, otherwise show the first letter of the name
                        ? <img src={u.photoUrl} alt={u.name} />
                        : u.name[0]
                    }
                </div>
                <div>{u.followed
                    ? <button onClick={() => props.unfollow(u.id)}>Unfollow</button>
                    : <button onClick={() => props.follow(u.id)}>Follow</button>}
                </div>
            </span>
            <span>
                <div>{u.name}</div>
                <div>{u.status}</div>
            </span>
            <span>
                <div>{u.location.country}</div>
                <div>{u.location.city}</div>
            </span>
        </div>)
    );
}

export default Users;