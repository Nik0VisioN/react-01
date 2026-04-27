import React from 'react';
import s from './Dialogs.module.css';
import { NavLink } from 'react-router-dom';

const DialogItem = (props) => {
  let path = "/chats/" + props.id;

  return <div className={s.dialog}>
    <NavLink to={path}>{props.name}</NavLink>
  </div>
}

const Message = (props) => {
  return <div className={s.dialog}>{props.message}</div>
}


const Dialogs = (props) => {
  

    let dialogsData = [
      { id: 1, name: 'Dima' },
      { id: 2, name: 'Sasha' },
      { id: 3, name: 'Sviat' },
      { id: 4, name: 'Iarik' },
      { id: 5, name: 'Sveta' },
      { id: 6, name: 'Katia' }
    ];

    let messagesData = [
      { id: 1, name: 'Hi' },
      { id: 2, name: 'How are you?' },
      { id: 3, name: 'Yo' },
      { id: 4, name: 'Hi' },
      { id: 5, name: 'Yo' },
      { id: 6, name: 'Hi' }
    ];
return (
    <div className={s.dialogs}>
      <div className={s.dialogs_items}>

        < DialogItem name={dialogsData[0].name} id={dialogsData[0].id} />
        < DialogItem name={dialogsData[1].name} id={dialogsData[1].id} />
        < DialogItem name={dialogsData[2].name} id={dialogsData[2].id} />
        < DialogItem name={dialogsData[3].name} id={dialogsData[3].id} />
        < DialogItem name={dialogsData[4].name} id={dialogsData[4].id} />
        < DialogItem name={dialogsData[5].name} id={dialogsData[5].id} />
      </div>

      <div className={s.messages}>

        < Message message={messagesData[0].name} id={messagesData[0].id} />
        < Message message={messagesData[1].name} id={messagesData[1].id} />
        < Message message={messagesData[2].name} id={messagesData[2].id} />
        
      </div>
    </div>
  )
}

export default Dialogs;