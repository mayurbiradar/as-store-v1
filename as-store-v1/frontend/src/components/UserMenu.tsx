import LogoutButton from './LogoutButton';
import { useUser } from '../context/UserContext';

export default function UserMenu() {
  const { user } = useUser();
  if (!user || !user.email) return null;
  return (
    <div className="flex items-center gap-4">
      <span className="font-bold text-gray-700">{user.firstName} {user.lastName} ({user.role})</span>
      <LogoutButton />
    </div>
  );
}
