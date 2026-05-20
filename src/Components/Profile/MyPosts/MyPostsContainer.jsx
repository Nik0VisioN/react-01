import { connect } from 'react-redux';
import { addPostActionCreator, updateNewPostTextActionCreator, removePostActionCreator, toggleLikeActionCreator } from '../../../Redux/profile_reducer';
import MyPosts from './MyPosts';


const mapStateToProps = (state) => ({
  posts: state.profilePage.postsData,
  newPostText: state.profilePage.newPostText,
});

const mapDispatchToProps = (dispatch) => ({
  addPost: () => dispatch(addPostActionCreator()),
  removePost: () => dispatch(removePostActionCreator()),
  updateNewPostText: (text) => dispatch(updateNewPostTextActionCreator(text)),
  toggleLike: (postId) => dispatch(toggleLikeActionCreator(postId)),
});

const MyPostsContainer = connect(mapStateToProps, mapDispatchToProps)(MyPosts);

export default MyPostsContainer;