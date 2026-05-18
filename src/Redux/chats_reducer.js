const UPDATE_NEW_MESSAGE_BODY = 'UPDATE_NEW_MESSAGE_BODY';
const SEND_MESSAGE = 'SEND_MESSAGE';

let initialState = {
    chatsData: [
        { id: 1, name: 'Dima', photo: null },
        { id: 2, name: 'Sasha', photo: null },
        { id: 3, name: 'Sviat', photo: null },
        { id: 4, name: 'Iarik', photo: null },
        { id: 5, name: 'Sveta', photo: null },
        { id: 6, name: 'Katia', photo: null }
    ],
    messagesData: [
        { id: 1, dialogId: 1, name: 'Hi' },
        { id: 2, dialogId: 2, name: 'How are you?' },
        { id: 3, dialogId: 3, name: 'Yo' },
        { id: 4, dialogId: 4, name: 'Hi' },
        { id: 5, dialogId: 5, name: 'Yo' },
        { id: 6, dialogId: 6, name: 'Hi' }
    ],
    newMessageBody: ''
}


const chatsReducer = (state = initialState, action) => {

    switch (action.type) {

        case UPDATE_NEW_MESSAGE_BODY:
            return {
                ...state,
                newMessageBody: action.body
            };


        case SEND_MESSAGE:
            return {
                ...state,
                newMessageBody: '',
                messagesData: [...state.messagesData, {
                    id: state.messagesData.length + 1,
                    dialogId: action.dialogId,
                    name: state.newMessageBody
                }]
            };

        default:
            return state;
    }
}


export const sendMessageCreator = (dialogId) => ({ type: SEND_MESSAGE, dialogId: dialogId });
export const updateNewMessageBodyCreator = (body) => ({
    type: UPDATE_NEW_MESSAGE_BODY,
    body: body
});



export default chatsReducer;