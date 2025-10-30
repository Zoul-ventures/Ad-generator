import React, { useEffect, useState } from 'react';
import LoginPage from './pages/Login.jsx';
import SignupPage from './pages/Signup.jsx';
import App from './App.jsx';
import {
  registerUser,
  signInUser,
  signOutUser,
  listenToAuthChanges,
  getUserProfile
} from './firebase/auth.js';

const Root = () => {
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || profile?.email || '',
            profile
          });
        } catch (error) {
          console.error('Failed to hydrate user profile from Firestore.', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || ''
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthenticated = async ({ email, password, remember }) => {
    await signInUser({ email, password, remember });
    setView('login');
  };

  const handleRegistered = async ({ email, password, firstName, lastName, phone }) => {
    await registerUser({ email, password, firstName, lastName, phone });
    setView('login');
  };

  const handleSignOut = async () => {
    await signOutUser();
    setView('login');
  };

  if (loading) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-brand">
            <img
              src="/assets/contento vector morado.svg"
              alt="Contento logo"
              className="login-brand-mark"
            />
            <span className="login-brand-badge">Creative Co-pilot</span>
          </div>
          <p className="login-subtitle">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (view === 'signup') {
      return (
        <SignupPage
          onRegistered={handleRegistered}
          onNavigateToLogin={() => setView('login')}
        />
      );
    }

    return (
      <LoginPage
        onAuthenticated={handleAuthenticated}
        onNavigateToSignup={() => setView('signup')}
      />
    );
  }

  return <App user={user} onSignOut={handleSignOut} />;
};

export default Root;
