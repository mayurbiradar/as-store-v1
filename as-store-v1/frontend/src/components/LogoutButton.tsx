import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../utils/authUtils';

export default function LogoutButton() {
  const navigate = useNavigate();
  const onLogout = async () => {
    await handleLogout();
    // Navigate to login with empty state to clear navigation history
    navigate('/login', { state: {} });
  };
  return (
    <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold" onClick={onLogout}>
      Logout
    </button>
  );
}
