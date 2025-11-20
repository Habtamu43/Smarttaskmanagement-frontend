import React, { useState } from 'react';
import { apiPost } from '../api';
import './Register.css';

export default function Register({ onRegister, onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      const res = await apiPost('/auth/register', { name, email, password });
      if (res.token) {
        onRegister(res.token); // redirect to dashboard
      } else {
        setErr(res.msg || 'Registration failed');
      }
    } catch (error) {
      setErr('Registration failed: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <form onSubmit={submit} className="register-form">
          <input
            className="input-field"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="input-field"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input-field"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {err && <p className="error-msg">{err}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
            <button type="button" className="btn-switch" onClick={onSwitch}>
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
