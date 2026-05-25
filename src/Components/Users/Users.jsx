import React from 'react';
import { Link } from 'react-router-dom';
import s from './Users.module.css';

const Users = (props) => {
    return (
        <div className={s.users_container}>
            {props.users.map(u =>
                <div key={u.id} className={s.user}>
                    <span>
                        <Link to={`/profile/${u.id}`} className={s.avatarLink}>
                            <div className={s.avatar}>
                                {u.photoUrl
                                    ? <img src={u.photoUrl} alt={u.name} />
                                    : u.name?.[0] || '?'
                                }
                            </div>
                        </Link>
                        <div>{u.followed
                            ? <button onClick={() => props.unfollow(u.id)}>Unfollow</button>
                            : <button onClick={() => props.follow(u.id)}>Follow</button>}
                        </div>
                    </span>
                    <span>
                        <Link to={`/profile/${u.id}`} className={s.nameLink}>
                            <div>{u.name}</div>
                        </Link>
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
};

export default Users;