import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import store from './Redux/redux_store';
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));

let rerenderEntireTree = () => {
root.render(
    <BrowserRouter>
        <App 
    store = {store} />
    </BrowserRouter>
);
}

rerenderEntireTree();

store.subscribe( () => {
    rerenderEntireTree()});
