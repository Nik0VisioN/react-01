import React from 'react';
import './App.css';
import Header from './Components/Header/Header';
import Navbar from './Components/Navbar/Navbar';
import Profile from './Components/Profile/Profile';
import Music from './Components/Music/Music';
import Saved from './Components/Saved/Saved';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ChatsContainer from './Components/Chats/ChatsContainer';
import UsersContainer from './Components/Users/UsersContainer';
import Authorisation from './Components/Auth/Authorisation';
import RequireAuth from './Components/Auth/RequireAuth';

const App = (props) => {
  const location = useLocation();

  // 🔧 Login рендерим отдельно, без app-wrapper и навбара
  if (location.pathname === '/login') {
    return <Authorisation />;
  }

  return (
    <div className='app-wrapper'>
      <Header />
      <Navbar />
      <div className='app-wrapper-content'>
        <Routes>
          <Route path='/' element={<Navigate to='/profile' replace />} />
          <Route path='/profile' element={<Profile store={props.store} />} />

          <Route path='/chats' element={
            <RequireAuth><ChatsContainer store={props.store} /></RequireAuth>
          } />
          <Route path='/chats/:id' element={
            <RequireAuth><ChatsContainer store={props.store} /></RequireAuth>
          } />
          <Route path='/users' element={
            <RequireAuth><UsersContainer /></RequireAuth>
          } />
          <Route path='/music' element={
            <RequireAuth><Music /></RequireAuth>
          } />
          <Route path='/saved' element={
            <RequireAuth><Saved /></RequireAuth>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;