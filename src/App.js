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
import Welcome from './Components/Welcome/Welcome';
import EditProfile from './Components/Profile/EditProfile';

const App = (props) => {
  const location = useLocation();

  // 🔧 Login rendere alone
  // if (location.pathname === '/login') {
  //   return <Authorisation />;
  // }
  if (location.pathname === '/login') return <Authorisation />;
  if (location.pathname === '/welcome') return <Welcome />;

  return (
    <div className='app-wrapper'>
      <Header />
      <Navbar />
      <div className='app-wrapper-content'>
        <Routes>
          <Route path='/' element={<Navigate to='/welcome' replace />} />
          {/* Public for all */}
          <Route path="/profile/:userId" element={<Profile />} />

          {/* Private! Only for authenticated users */}
          <Route path="/profile/edit" element={
            <RequireAuth><EditProfile /></RequireAuth>
          } />
          <Route path="/profile" element={
            <RequireAuth><Profile /></RequireAuth>
          } />
          <Route path="/users" element={
            <RequireAuth><UsersContainer /></RequireAuth>
          } />
          <Route path="/chats" element={
            <RequireAuth><ChatsContainer store={props.store} /></RequireAuth>
          } />
          <Route path="/chats/:id" element={
            <RequireAuth><ChatsContainer store={props.store} /></RequireAuth>
          } />
          <Route path="/music" element={
            <RequireAuth><Music /></RequireAuth>
          } />
          <Route path="/saved" element={
            <RequireAuth><Saved /></RequireAuth>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;