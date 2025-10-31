import React, { useEffect, useState } from 'react';
import LandingPage from './pages/Landing.jsx';
import LoginPage from './pages/Login.jsx';
import SignupPage from './pages/Signup.jsx';
import TermsPage from './pages/Terms.jsx';
import PrivacyPage from './pages/Privacy.jsx';
import App from './App.jsx';
import {
  registerUser,
  signInUser,
  signOutUser,
  listenToAuthChanges,
  getUserProfile
} from './firebase/auth.js';

const Root = () => {
  const [view, setView] = useState('landing');
  const [returnView, setReturnView] = useState('login');
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
    setReturnView('login');
    setView('login');
  };

  const handleRegistered = async ({ email, password, firstName, lastName, phone }) => {
    await registerUser({ email, password, firstName, lastName, phone });
    setReturnView('login');
    setView('login');
  };

  const handleSignOut = async () => {
    await signOutUser();
    setReturnView('login');
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
    if (view === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => setView('login')}
          onOpenTerms={() => {
            setReturnView('landing');
            setView('terms');
          }}
          onOpenPrivacy={() => {
            setReturnView('landing');
            setView('privacy');
          }}
        />
      );
    }

    if (view === 'terms') {
      return <TermsPage onBack={() => setView(returnView)} />;
    }
    if (view === 'privacy') {
      return <PrivacyPage onBack={() => setView(returnView)} />;
    }
    if (view === 'signup') {
      return (
        <SignupPage
          onRegistered={handleRegistered}
          onNavigateToLogin={() => setView('login')}
          onNavigateToTerms={() => {
            setReturnView('signup');
            setView('terms');
          }}
          onNavigateToPrivacy={() => {
            setReturnView('signup');
            setView('privacy');
          }}
        />
      );
    }

    return (
      <LoginPage
        onAuthenticated={handleAuthenticated}
        onNavigateToSignup={() => setView('signup')}
        onNavigateToTerms={() => {
          setReturnView('login');
          setView('terms');
        }}
        onNavigateToPrivacy={() => {
          setReturnView('login');
          setView('privacy');
        }}
      />
    );
  }

  return <App user={user} onSignOut={handleSignOut} />;
};

export default Root;
