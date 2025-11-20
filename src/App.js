import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { apiGet } from './api'; // import API helper to test backend

function App() {
  const [token, setToken] = useState(null);
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(true);

  // Check if token exists on initial load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setView('dashboard');
    }
    setLoading(false);
  }, []);

  // Test backend connection when token is available
  useEffect(() => {
    if (!token) return;

    async function testBackend() {
      try {
        console.log("Testing backend API...");
        const res = await apiGet('/tasks', token);
        console.log("Backend test response:", res);
      } catch (err) {
        console.error("Error calling backend:", err);
      }
    }

    testBackend();
  }, [token]);

  const handleLogin = (t) => {
    setToken(t);
    localStorage.setItem('token', t);
    setView('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setView('login');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  if (!token) {
    return view === 'login' ? (
      <Login onLogin={handleLogin} onSwitch={() => setView('register')} />
    ) : (
      <Register onRegister={handleLogin} onSwitch={() => setView('login')} />
    );
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
}

export default App;
