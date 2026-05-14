import React, { useEffect, useRef } from 'react';
import s from './Chats.module.css';
import DialogItem from './DialogItem/DialogsItem';
import Message from './Message/Message';
import { useParams, useNavigate } from 'react-router-dom'




const Chats = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (id) navigate('/chats');
    }
  }, [id, navigate]);

  let state = props.chatsPage;

  let dialogsElements = state.chatsData.map(dialog => < DialogItem
    name={dialog.name}
    id={dialog.id}
    key={dialog.id}
    photo={dialog.photo} />);

  let messagesElements = id
    ? state.messagesData
      .filter(message => message.dialogId === +id)
      .map(message => <Message message={message.name} key={message.id} />)
    : <p className={s.select_dialog}>Choose a dialog</p>

  let newMessageBody = state.newMessageBody;


  let OnSendMessageClick = () => {
    props.sendMessage(+id);
  }

  let onNewMessageChange = (e) => {
    let body = e.target.value;
    props.updateNewMessageBody(body);
  }


return (
  <div className={s.dialogs}>
    <div className={s.dialogs_items}>
      {dialogsElements}
    </div>

    <div className={s.messages}>
      <div>{messagesElements}</div>

      {id && (
        <div className={s.message_editor}>
          <textarea
            value={newMessageBody}
            onChange={onNewMessageChange}
            placeholder='Enter your message'
          />
          <button onClick={OnSendMessageClick}>Send</button>
        </div>
      )}
    </div>
  </div>
)
}

export default Chats;