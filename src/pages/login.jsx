import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './login.css';

export function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validPattern = /^[a-zA-Z]+[1-6]$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!login.trim() || !password.trim()) {
      setError('Fill all fields!');
      return;
    }

    if (!validPattern.test(login) || !validPattern.test(password)) {
      setError('Incorrect login or password');
      return;
    }

    Cookies.set('isAuthenticated', 'true', { expires: 1 });
    Cookies.set('username', login, { expires: 1 });

    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">Log to Web App</h2>
        {error && <div className="login-error">{error}</div>}
        
        <div className="login-input-group">
          <label className="login-label">E-mail / Username</label>
          <input 
            type="text" 
            value={login} 
            onChange={(e) => setLogin(e.target.value)} 
            placeholder="mark5"
            className="login-input"
          />
        </div>

        <div className="login-input-group">
          <label className="login-label">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="login-input"
          />
        </div>

        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}