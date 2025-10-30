import React, { useState } from 'react';
import LoginPage from './pages/Login.jsx';
import App from './App.jsx';

const Root = () => {
  const [session, setSession] = useState({ isAuthenticated: false, user: null });

  const handleAuthenticated = (userInfo) => {
    setSession({
      isAuthenticated: true,
      user: {
        email: userInfo.email,
        remember: Boolean(userInfo.remember)
      }
    });
  };

  const handleSignOut = () => {
    setSession({ isAuthenticated: false, user: null });
  };

  if (!session.isAuthenticated) {
    return <LoginPage onAuthenticated={handleAuthenticated} />;
  }

  return <App user={session.user} onSignOut={handleSignOut} />;
};

export default Root;
