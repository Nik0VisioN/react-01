import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import store from './Redux/redux_store';
import './index.css';
import { Provider } from 'react-redux';
import { AuthProvider } from './AuthContext';
import { PresenceProvider } from './Components/Auth/PresenceContext';



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

    <BrowserRouter>
        <Provider store={store}>
            <AuthProvider>
                <PresenceProvider>
                    <App />
                </PresenceProvider>
            </AuthProvider>
        </Provider>
    </BrowserRouter>
);
