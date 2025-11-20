import React, { useState, useEffect } from 'react';
import { apiPost } from '../api';
import './Auth.css';

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [dark, setDark] = useState(false);

  // Restore theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDark(saved === "dark");
  }, []);

  // Persist theme
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const submit = async (e) => {
    e.preventDefault();
    const res = await apiPost('/auth/login', { email, password });
    if (res.token) onLogin(res.token);
    else setErr(res.msg || 'Login failed');
  };

  return (
    <div className={`auth-container ${dark ? "dark" : "light"}`}>
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form className="auth-form" onSubmit={submit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn-submit" type="submit">Login</button>
        </form>

        <p className="switch-text">
          Don't have an account?{' '}
          <button className="btn-switch" onClick={onSwitch}>
            Register
          </button>
        </p>

        {err && <p className="error-msg">{err}</p>}
      </div>
    </div>
  );
}
