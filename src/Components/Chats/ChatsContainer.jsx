import { connect } from 'react-redux';
import { sendMessageCreator, updateNewMessageBodyCreator } from '../../Redux/chats_reducer';
import Chats from './Chats';


// const ChatsContainer = () => {


//   return <StoreContext.Consumer>
//     {store => {

//       let state = store.getState().chatsPage;

//       let OnSendMessageClick = (dialogId) => {
//         store.dispatch(sendMessageCreator(dialogId));
//       }

//       let onNewMessageChange = (body) => {
//         store.dispatch(updateNewMessageBodyCreator(body));
//       }


//       return <Chats
//         updateNewMessageBody={onNewMessageChange}
//         sendMessage={OnSendMessageClick}
//         chatsPage={state}
//       />
//     }
//     }
//   </StoreContext.Consumer>
// }


const mapStateToProps = (state) => {
  return {
    chatsPage: state.chatsPage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateNewMessageBody: (body) => {
      dispatch(updateNewMessageBodyCreator(body));
    },
    sendMessage: (dialogId) => {
      dispatch(sendMessageCreator(dialogId));

    },
  }
}


const ChatsContainer = connect(mapStateToProps, mapDispatchToProps)(Chats);

export default ChatsContainer;