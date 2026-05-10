import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
//import reportWebVitals from './reportWebVitals';
import { addPost } from './Redux/state';
import state from './Redux/state';
import './index.css';
import { updateNewPostText } from './Redux/state';
import { subscribe } from './Redux/state';



const root = ReactDOM.createRoot(document.getElementById('root'));

let rerenderEntireTree = (state) => {
root.render(
    <BrowserRouter>
    <App state={state} addPost={addPost} updateNewPostText={updateNewPostText} />
    </BrowserRouter>
);
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

rerenderEntireTree(state);

subscribe(rerenderEntireTree);
