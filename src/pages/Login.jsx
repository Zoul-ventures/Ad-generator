import React, { useState } from 'react';

const initialForm = {
  email: '',
  password: '',
  remember: false
};

const LoginPage = ({ onAuthenticated }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const VALID_EMAIL = 'root@local.dev';
  const VALID_USERNAME = 'root';
  const VALID_PASSWORD = 'admin';

  const normaliseLogin = (value) => value.trim().toLowerCase();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password.trim()) {
      setError('Enter your email and password to continue.');
      return;
    }

    const identifier = normaliseLogin(form.email);
    const matchesEmail = identifier === VALID_EMAIL;
    const matchesUser = identifier === normaliseLogin(VALID_USERNAME);
    const matchesPassword = form.password === VALID_PASSWORD;

    if (!matchesPassword || (!matchesEmail && !matchesUser)) {
      setError('Invalid credentials. Try root / admin to sign in.');
      return;
    }

    if (typeof onAuthenticated === 'function') {
      onAuthenticated({
        email: matchesEmail ? VALID_EMAIL : `${VALID_USERNAME}@local.dev`,
        remember: form.remember
      });
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
            <span>Email or username</span>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="root or root@local.dev"
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
              minLength={4}
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

          <button type="submit" className="button primary login-submit">
            Sign in
          </button>
        </form>

        <div className="login-footer">
          <button type="button" className="button ghost login-support">
            Need a workspace invite?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
