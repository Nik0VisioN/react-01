import React from 'react';
import './App.css';
import Header from './Components/Header/Header';
import Navbar from './Components/Navbar/Navbar';
import Profile from './Components/Profile/Profile';
import Music from './Components/Music/Music';
import Saved from './Components/Saved/Saved';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatsContainer from './Components/Chats/ChatsContainer';
import UsersContainer from './Components/Users/UsersContainer';


const App = (props) => {

  return (

    <div className='app-wrapper'>
      <Header />
      <Navbar />
      <div className='app-wrapper-content'>
        <Routes>
          <Route path='/' element={<Navigate to='/profile' replace />} />

          <Route path='/profile' element={<Profile
            store={props.store}
          />} />

          <Route path='/chats' element={<ChatsContainer store={props.store} />} />

          <Route path='/chats/:id' element={<ChatsContainer store={props.store} />} />

          <Route path='/users' element={<UsersContainer />} />

          <Route path='/music' element={<Music />} />

          <Route path='/saved' element={<Saved />} />
        </Routes>
      </div>

    </div>);
}

export default App;
