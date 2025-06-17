import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../utils/user';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'admin') {
  navigate('/admin');
} else if (user.role === 'employee') {
  navigate('/user');
}
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-circle fs-1 text-primary"></i>
          <h4 className="fw-bold mt-2">Login</h4>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            <i className="bi bi-person-fill me-2"></i>Username
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            <i className="bi bi-lock-fill me-2"></i>Password
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          <i className="bi bi-box-arrow-in-right me-2"></i>Login
        </button>
      </div>
    </div>
  );
};

export default Login;
