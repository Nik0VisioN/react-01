import './App.css';
import Header from './Components/Header/Header';
import Navbar from './Components/Navbar/Navbar';
import Profile from './Components/Profile/Profile';
import Chats from './Components/Dialogs/Dialogs';
import Music from './Components/Music/Music';
import Saved from './Components/Saved/Saved';
import { Routes, Route } from 'react-router-dom';


const App = (props) => {
  return (

    <div className='app-wrapper'>
      <Header />
      <Navbar />
      <div className='app-wrapper-content'>
        <Routes>
          <Route path='/profile' element={<Profile
            profilePage={props.state.profilePage}
            dispatch={props.dispatch}
          />} />

          <Route path='/chats' element={<Chats state={props.state.chatsPage} />} />

          <Route path='/chats/:id' element={<Chats state={props.state.chatsPage} />} />

          <Route path='/music' element={<Music />} />

          <Route path='/saved' element={<Saved />} />
        </Routes>
      </div>

    </div>);
}

export default App;
