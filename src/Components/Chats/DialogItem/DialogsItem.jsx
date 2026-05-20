import React from 'react';
import { NavLink } from 'react-router-dom';
import s from './DialogsItem.module.css';

const DialogItem = (props) => {
  let path = "/chats/" + props.id;

  return <div className={s.dialog}>
    <NavLink to={path} className={({ isActive }) => isActive ? s.active : ''}>
      <div className={s.avatar}>
        {props.photo
          ? <img src={props.photo} alt={props.name} />
          : props.name[0]
        }
      </div>
      <span>{props.name}</span>
    </NavLink>
  </div>
}

export default DialogItem;