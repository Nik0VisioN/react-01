import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header/Header';
import Navbar from './Components/Navbar/Navbar';
import Profile from './Components/Profile/Profile';
import Chats from './Components/Dialogs/Dialogs';
import Music from './Components/Music/Music';
import Saved from './Components/Saved/Saved';
import { BrowserRouter, Routes,  Route } from 'react-router-dom';


let ChatsComponent = (props) => <Chats />

const App = (props) => {
  return (
    <BrowserRouter>
      <div className='app-wrapper'>
        <Header />
        <Navbar />
        <div className='app-wrapper-content'>
          <Routes>
            <Route path='/profile' element={<Profile />} />
            <Route path='/chats/*' element={<ChatsComponent />} />
            <Route path='/music' element={<Music />} />
            <Route path='/saved' element={<Saved />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>);
}

export default App;
