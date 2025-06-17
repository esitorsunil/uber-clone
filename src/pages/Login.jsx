import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../utils/user'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  const handleLogin = () => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      const user = users.find(
        (u) =>
          u.username.trim().toLowerCase() === username.trim().toLowerCase() &&
          u.password === password
      );

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('user-changed'));

        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'employee') {
          navigate('/user');
        }
      } else {
        setError('Invalid username or password');
      }

      setLoading(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-circle fs-1 text-primary"></i>
          <h4 className="fw-bold mt-2">Welcome Back</h4>
          <p className="text-muted mb-0">Please enter your login details</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            <i className="bi bi-person-fill me-2"></i>Username
          </label>
          <input
            ref={usernameRef}
            type="text"
            className="form-control"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            <i className="bi bi-lock-fill me-2"></i>Password
          </label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />          
          </div>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm me-2"></span>
          ) : (
            <i className="bi bi-box-arrow-in-right me-2"></i>
          )}
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Login;
