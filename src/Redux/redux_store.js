import { configureStore } from "@reduxjs/toolkit";
import profileReducer from './profile_reducer';
import chatsReducer from './chats_reducer';
import sidebarReducer from './sidebar_reducer';
import usersReducer from './users_reducer';



let store = configureStore({
    reducer: {
        profilePage: profileReducer,
        chatsPage: chatsReducer,
        sidebar: sidebarReducer,
        usersPage: usersReducer
    }
});

window.store = store;

export default store;