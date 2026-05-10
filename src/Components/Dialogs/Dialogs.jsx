import React, { useEffect, useRef } from 'react';
import s from './Dialogs.module.css';
import DialogItem from './DialogItem/DialogsItem';
import Message from './Message/Message';
import { useParams, useNavigate } from 'react-router-dom'




const Dialogs = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();


  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (id) navigate('/chats');
    }
  }, [id, navigate]);


  let dialogsElements = props.state.dialogsData.map(dialog => < DialogItem
    name={dialog.name}
    id={dialog.id}
    key={dialog.id}
    photo={dialog.photo} />);

  let messagesElements = id
    ? props.state.messagesData
      .filter(message => message.dialogId === +id)
      .map(message => <Message message={message.name} key={message.id} />)
    : <p className={s.select_dialog}>Выберите диалог</p>

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