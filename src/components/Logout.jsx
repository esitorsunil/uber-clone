import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('user-changed')); 
    navigate('/login');
  };

  return (
    <button className="btn text-white" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
