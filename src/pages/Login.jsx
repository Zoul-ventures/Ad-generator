import React, { useState } from 'react';

const initialForm = {
  email: '',
  password: '',
  remember: false
};

const LoginPage = ({ onAuthenticated, onNavigateToSignup, onNavigateToTerms, onNavigateToPrivacy }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!email || !password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (typeof onAuthenticated === 'function') {
        await onAuthenticated({
          email,
          password,
          remember: form.remember
        });
      }
    } catch (authError) {
      const message =
        authError?.message ||
        'We could not sign you in right now. Double-check your credentials and try again.';

      if (authError?.code === 'auth/invalid-credential') {
        setError('Incorrect email or password. Please try again.');
      } else if (authError?.code === 'auth/user-not-found') {
        setError('No account found with that email. You can create one below.');
      } else if (authError?.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a moment before trying again.');
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <h1>Sign in to continue</h1>
        <p className="login-subtitle">
          Access your workspace, track generated visuals, and manage your tokens.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Email</span>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@brand.com"
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </label>

          <label className="login-remember">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            />
            <span>Keep me signed in</span>
          </label>

          {error ? <div className="login-error">{error}</div> : null}

          <button type="submit" className="button primary login-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="auth-switch">
          <span>New here?</span>
          <button type="button" onClick={onNavigateToSignup}>
            Create account
          </button>
        </div>
        <div className="auth-legal-hint">
          <span>
            Al continuar aceptas los{' '}
            <button type="button" className="link-button" onClick={onNavigateToTerms}>
              Términos
            </button>{' '}
            y la{' '}
            <button type="button" className="link-button" onClick={onNavigateToPrivacy}>
              Política de Privacidad
            </button>
            .
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
