import userPhoto from '../Logo_Channel.png';

const UPDATE_NEW_POST_TEXT = 'UPDATE_NEW_POST_TEXT';
const REMOVE_POST = 'REMOVE_POST';
const TOGGLE_LIKE = 'TOGGLE_LIKE';
const SET_POSTS = 'SET_POSTS';
const SET_USER_INFO = 'SET_USER_INFO';

let initialState = {
    userInfo: {
        name: 'NikoVisioN',
        title: 'IT Developer',
        location: 'Ukraine',
        photo: userPhoto,
    },
    postsData: [],
    newPostText: ''
};


const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_POSTS:
            return {
                ...state,
                postsData: action.posts
            };


        case SET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo
            };


        case UPDATE_NEW_POST_TEXT:
            return {
                ...state,
                newPostText: action.newText
            };

        case REMOVE_POST:
            return {
                ...state,
                postsData: state.postsData.filter(post => post.id !== action.postId),
                newPostText: '' //!!!
            };

        case TOGGLE_LIKE:
            return {
                ...state,
                postsData: state.postsData.map(post => post.id === action.postId
                    ? { ...post, liked: !post.liked, likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1 }
                    : post
                )
            };
        default:
            return state;
    }

}

export const setPostsActionCreator = (posts) => ({ type: SET_POSTS, posts });
export const setUserInfoActionCreator = (userInfo) => ({ type: SET_USER_INFO, userInfo });
export const updateNewPostTextActionCreator = (newText) => ({
    type: UPDATE_NEW_POST_TEXT,
    newText: newText
});
export const removePostActionCreator = (postId) => ({ type: REMOVE_POST, postId });
export const toggleLikeActionCreator = (postId) => ({ type: TOGGLE_LIKE, postId });


export default profileReducer;