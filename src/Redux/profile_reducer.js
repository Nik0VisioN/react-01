import userPhoto from '../Logo_Channel.png';

const ADD_POST = 'ADD_POST';
const UPDATE_NEW_POST_TEXT = 'UPDATE_NEW_POST_TEXT';
const CLEAR_NEW_POST = 'CLEAR_NEW_POST';
const TOGGLE_LIKE = 'TOGGLE_LIKE';
const SET_POSTS = 'SET_POSTS';

let initialState = {
    userInfo: {
        name: 'NikoVisioN',
        title: 'IT Developer',
        location: 'Ukraine',
        photo: userPhoto,
    },
    postsData: [],
    newPostText: ''
}


const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_POSTS:
            return {
                ...state,
                postsData: action.posts
            };


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

        case TOGGLE_LIKE:
            return {
                ...state,
                postsData: state.postsData.map(post =>
                    post.id === action.postId
                        ? { ...post, liked: !post.liked, likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1 }
                        : post
                )
            };
        default:
            return state;
    }

}

export const setPostsActionCreator = (posts) => ({ type: SET_POSTS, posts });
export const addPostActionCreator = () => ({ type: ADD_POST });
export const updateNewPostTextActionCreator = (newText) => ({
    type: UPDATE_NEW_POST_TEXT,
    newText: newText
});
export const removePostActionCreator = () => ({ type: CLEAR_NEW_POST });
export const toggleLikeActionCreator = (postId) => ({ type: TOGGLE_LIKE, postId });


export default profileReducer;