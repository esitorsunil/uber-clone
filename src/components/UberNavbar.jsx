import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './Logout';

const UberNavbar = () => {
  const [username, setUsername] = useState('Guest');
  const [role, setRole] = useState('user');

  const loadUser = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUsername(storedUser.username);
      setRole(storedUser.role);
    } else {
      setUsername('Guest');
      setRole('user');
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener('user-changed', loadUser);
    return () => window.removeEventListener('user-changed', loadUser);
  }, []);

  const linkPath = role === 'admin' ? '/admin' : '/user';

  return (
    <nav className="navbar navbar-dark bg-black shadow-sm px-3 py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center flex-nowrap">

        <Link className="navbar-brand" to={linkPath}>
          <img
            src="https://www.pranathiss.com/static/assets/images/pranathiss-white.webp"
            alt="Company Logo"
            style={{ height: '35px', objectFit: 'contain' }}
          />
        </Link>

        <div className="d-flex align-items-center gap-2 text-white small flex-shrink-0">
          <span className="d-none d-sm-inline">Welcome, <strong>{username}</strong></span>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default UberNavbar;
