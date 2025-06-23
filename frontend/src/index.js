import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './contexts/authContext';
import { ChitContextProvider } from './contexts/chitContext';
import { FollowContextProvider } from './contexts/followContext';
import { FollowerContextProvider } from './contexts/followerContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ChitContextProvider>
        <FollowContextProvider>
          <FollowerContextProvider>
            <App />
          </FollowerContextProvider>
        </FollowContextProvider>
      </ChitContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);