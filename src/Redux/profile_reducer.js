const ADD_POST = 'ADD_POST';
const UPDATE_NEW_POST_TEXT = 'UPDATE_NEW_POST_TEXT';
const CLEAR_NEW_POST = 'CLEAR_NEW_POST';

let initialState = {
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
}


const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST:
            return {
                ...state,
                postsData: [...state.postsData, {
                    id: state.postsData.length + 1,
                    message: state.newPostText,
                    likesCount: 0
                }],
                newPostText: ''
            };

        case UPDATE_NEW_POST_TEXT:
            return {
                ...state,
                newPostText: action.newText
            };

        case CLEAR_NEW_POST:
            return {
                ...state,
                newPostText: ''
            };

        default:
            return state;
    }

}

export const addPostActionCreator = () => ({ type: ADD_POST });
export const updateNewPostTextActionCreator = (newText) => ({
    type: UPDATE_NEW_POST_TEXT,
    newText: newText
});
export const removePostActionCreator = () => ({ type: CLEAR_NEW_POST });



export default profileReducer;