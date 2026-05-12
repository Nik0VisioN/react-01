const ADD_POST = 'ADD_POST';
const UPDATE_NEW_POST_TEXT = 'UPDATE_NEW_POST_TEXT';
const UPDATE_NEW_MESSAGE_BODY = 'UPDATE_NEW_MESSAGE_BODY';
const SEND_MESSAGE = 'SEND_MESSAGE';
const CLEAR_NEW_POST = 'CLEAR_NEW_POST';

let store = {
    _state: {
        profilePage: {
            userInfo: {
                name: 'NikoVisioN',
                title: 'IT Developer',
                location: 'Ukraine',
                photo: "NvN"
            },
            postsData: [
                { id: 1, message: 'Hello, world!', likesCount: 15 },
                { id: 2, message: 'How are you?', likesCount: 20 },
                { id: 3, message: 'This is my first post!', likesCount: 30 },
                { id: 4, message: 'Hi', likesCount: 25 },
                { id: 5, message: 'Yo', likesCount: 10 },
                { id: 6, message: 'Bka', likesCount: 5 },
                { id: 7, message: 'LOASJDAWHD', likesCount: 88 },
                { id: 8, message: 'BLABKA', likesCount: 75 },
                { id: 9, message: 'hahahahha', likesCount: 73 }
            ],
            newPostText: ''
        },

        chatsPage: {
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
            newMessageBody: '',
        }
    },

        



    _callSubscriber() {
        console.log('State changed')
    },



    getState() {
        return this._state;
    },
    subscribe(observer) {
        this._callSubscriber = observer;
    },


    dispatch(action) {
        if (action.type === ADD_POST) {
            let NewPost = {
                id: 5,
                message: this._state.profilePage.newPostText,
                likesCount: 0
            };
            this._state.profilePage.postsData.push(NewPost);
            this._state.profilePage.newPostText = '';
            this._callSubscriber(this._state);
        }
        else if (action.type === UPDATE_NEW_POST_TEXT) {
            this._state.profilePage.newPostText = action.newText;
            this._callSubscriber(this._state);
        }
        else if (action.type === UPDATE_NEW_MESSAGE_BODY) {
            this._state.chatsPage.newMessageBody = action.body;
            this._callSubscriber(this._state);
        }
        else if (action.type === SEND_MESSAGE) {
            let body = this._state.chatsPage.newMessageBody;
            this._state.chatsPage.newMessageBody = '';
            this._state.chatsPage.messagesData.push({dialogId: action.dialogId, name: body });
            this._callSubscriber(this._state);
        }
            else if (action.type === CLEAR_NEW_POST) {
                this._state.profilePage.newPostText = '';
                this._callSubscriber(this._state);
            }
    }
}

export const addPostActionCreator = () => ({type: ADD_POST});
export const updateNewPostTextActionCreator = (newText) => ({
    type: UPDATE_NEW_POST_TEXT,
    newText: newText
});
export const removePostActionCreator = () => ({type: CLEAR_NEW_POST});


export const sendMessageCreator = (dialogId) => ({type: SEND_MESSAGE, dialogId: dialogId});
export const updateNewMessageBodyCreator = (body) => ({
    type: UPDATE_NEW_MESSAGE_BODY,
    body: body
});


window.state = store;
export default store;
