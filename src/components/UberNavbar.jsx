import { Link } from 'react-router-dom';
import LogoutButton from './Logout';

const UberNavbar = () => {
  const currentUser = JSON.parse(localStorage.getItem('user')); 
  const role = currentUser?.role;

  const linkPath = role === 'admin' ? '/admin' : '/user';
  const displayName = role === 'admin' ? 'Admin' : 'User';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black shadow-sm p-2 px-5">
      <div className="nav w-100 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-4">
          <Link className="navbar-brand mb-0" to={linkPath}>
            <h4 className="text-white mb-0">{displayName} Panel</h4>
          </Link>
        </div>

        <ul className="navbar-nav">
          <li className="nav-item">
            <LogoutButton />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default UberNavbar;
