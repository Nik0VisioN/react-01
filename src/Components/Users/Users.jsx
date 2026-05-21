import React from 'react';
import s from './Users.module.css';

let Users = (props) => {

    return (
        <div className={s.users_container}>
            {props.users.map(u =>
                <div key={u.id} className={s.user}>
                    <span>
                        <div className={s.avatar}>
                            {u.photoUrl
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
                        <div>{u.location?.country}</div>
                        <div>{u.location?.city}</div>
                    </span>
                </div>
            )}
        </div>
    );
}

export default Users;