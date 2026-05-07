import React from 'react';
import s from './Dialogs.module.css';
import DialogItem from './DialogItem/DialogsItem';
import Message from './Message/Message';
import { dialogsData } from '../../index';
import { messagesData } from '../../index';

const Dialogs = (props) => {

    let dialogsElements = dialogsData.map( dialog => < DialogItem name={dialog.name} id={dialog.id} />);
    let messagesElements = messagesData.map( message => < Message message={message.name} />);
    
return (
    <div className={s.dialogs}>
      <div className={s.dialogs_items}>
        {dialogsElements}
      </div>

      <div className={s.messages}>
        {messagesElements}
      </div>
    </div>
  )
}

export default Dialogs;