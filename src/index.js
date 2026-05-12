import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import store from './Redux/state';
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));

let rerenderEntireTree = (state) => {
root.render(
    <BrowserRouter>
    <App 
    state={state} 
    dispatch={store.dispatch.bind(store)}
    store = {store} />
    </BrowserRouter>
);
}

rerenderEntireTree(store.getState());

store.subscribe(rerenderEntireTree);
