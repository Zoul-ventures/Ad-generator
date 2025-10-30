import React, { useMemo, useState } from 'react';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
};

const SignupPage = ({ onRegistered, onNavigateToLogin }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordStrength = useMemo(() => {
    const trimmed = form.password.trim();
    if (!trimmed) {
      return null;
    }

    const checks = [
      /[A-Z]/.test(trimmed),
      /[a-z]/.test(trimmed),
      /[0-9]/.test(trimmed),
      /[^A-Za-z0-9]/.test(trimmed)
    ];

    const score = checks.filter(Boolean).length + (trimmed.length >= 12 ? 1 : 0);

    if (score >= 4) {
      return 'strong';
    }
    if (score >= 3) {
      return 'medium';
    }
    return 'weak';
  }, [form.password]);

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

    const trimmed = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password.trim(),
      confirmPassword: form.confirmPassword.trim()
    };

    if (!trimmed.firstName || !trimmed.lastName) {
      setError('Add your first and last name to create an account.');
      return;
    }
    if (!trimmed.email) {
      setError('Enter a valid email address.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed.email)) {
      setError('Please use a valid email format (example@domain.com).');
      return;
    }
    if (trimmed.password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }
    if (trimmed.password !== trimmed.confirmPassword) {
      setError('Passwords must match.');
      return;
    }
    if (!form.agreeTerms) {
      setError('Please accept the terms to continue.');
      return;
    }

    if (typeof onRegistered === 'function') {
      setIsSubmitting(true);
      try {
        await onRegistered({
          email: trimmed.email,
          password: trimmed.password,
          firstName: trimmed.firstName,
          lastName: trimmed.lastName,
          phone: trimmed.phone || null
        });
      } catch (signupError) {
        if (signupError?.code === 'auth/email-already-in-use') {
          setError('This email is already registered. Try signing in instead.');
        } else {
          setError(
            signupError?.message ||
              'We could not create your account right now. Please try again.'
          );
        }
      } finally {
        setIsSubmitting(false);
      }
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

        <h1>Create your workspace</h1>
        <p className="login-subtitle">
          Unlock the dashboard to manage brand assets, generated images, and token balances.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="auth-grid">
            <label className="login-field">
              <span>First name</span>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="e.g. Jordan"
                required
              />
            </label>
            <label className="login-field">
              <span>Last name</span>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="e.g. Winters"
                required
              />
            </label>
          </div>

          <label className="login-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@brand.com"
              required
            />
          </label>

          <label className="login-field">
            <span>Phone number (optional)</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 555 123 4567"
            />
          </label>

          <div className="auth-grid">
            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                minLength={8}
              />
            </label>
            <label className="login-field">
              <span>Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                minLength={8}
              />
            </label>
          </div>

          {passwordStrength ? (
            <div className={`password-strength password-strength-${passwordStrength}`}>
              Password strength: <strong>{passwordStrength}</strong>
            </div>
          ) : null}

          <label className="login-remember auth-consent">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={form.agreeTerms}
              onChange={handleChange}
            />
            <span>
              I agree to the <a href="#terms">terms</a> and <a href="#privacy">privacy policy</a>.
            </span>
          </label>

          {error ? <div className="login-error">{error}</div> : null}

          <button type="submit" className="button primary login-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-switch">
          <span>Already have an account?</span>
          <button type="button" onClick={onNavigateToLogin}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
