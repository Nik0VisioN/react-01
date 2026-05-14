import { sendMessageCreator, updateNewMessageBodyCreator } from '../../Redux/chats_reducer';
import Chats from './Chats'




const Chats_Container = (props) => {
 

  let state = props.store.getState().chatsPage;

  let OnSendMessageClick = (dialogId) => {
    props.store.dispatch(sendMessageCreator(dialogId));
  }

  let onNewMessageChange = (body) => {
    props.store.dispatch(updateNewMessageBodyCreator(body));
  }


return (
  <Chats 
  updateNewMessageBody = {onNewMessageChange} 
  sendMessage = {OnSendMessageClick}
  chatsPage = {state}
  />
)
}

export default Chats_Container;