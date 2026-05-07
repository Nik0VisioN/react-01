import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';



let postsData = [
  { id: 1, message: 'Hello, world!', likesCount: 15 },
  { id: 2, message: 'How are you?', likesCount: 20 },
  { id: 3, message: 'This is my first post!', likesCount: 30 },
  { id: 4, message: 'Hi', likesCount: 25 },
  { id: 5, message: 'Yo', likesCount: 10 },
  { id: 6, message: 'Bka', likesCount: 5 },
  { id: 7, message: 'LOASJDAWHD', likesCount: 88 },
  { id: 8, message: 'BLABKA', likesCount: 75 },
  { id: 9, message: 'hahahahha', likesCount: 73 }
];



let dialogsData = [
  { id: 1, name: 'Dima' },
  { id: 2, name: 'Sasha' },
  { id: 3, name: 'Sviat' },
  { id: 4, name: 'Iarik' },
  { id: 5, name: 'Sveta' },
  { id: 6, name: 'Katia' }
];

let messagesData = [
  { id: 1, name: 'Hi' },
  { id: 2, name: 'How are you?' },
  { id: 3, name: 'Yo' },
  { id: 4, name: 'Hi' },
  { id: 5, name: 'Yo' },
  { id: 6, name: 'Hi' }
];



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export { postsData };
export { dialogsData };
export { messagesData };
