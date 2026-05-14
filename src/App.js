import './App.css';
import Header from './Components/Header/Header';
import Navbar from './Components/Navbar/Navbar';
import Profile from './Components/Profile/Profile';
import Music from './Components/Music/Music';
import Saved from './Components/Saved/Saved';
import { Routes, Route } from 'react-router-dom';
import ChatsContainer from './Components/Chats/ChatsContainer';


const App = (props) => {
  return (

    <div className='app-wrapper'>
      <Header />
      <Navbar />
      <div className='app-wrapper-content'>
        <Routes>
          <Route path='/profile' element={<Profile
            store={props.store}
          />} />

          <Route path='/chats' element={<ChatsContainer store={props.store} />} />

          <Route path='/chats/:id' element={<ChatsContainer store={props.store} />} />

          <Route path='/music' element={<Music />} />

          <Route path='/saved' element={<Saved />} />
        </Routes>
      </div>

    </div>);
}

export default App;
