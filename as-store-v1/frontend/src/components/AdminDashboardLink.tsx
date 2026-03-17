import { useUser } from '../context/UserContext';

export default function AdminDashboardLink() {
  const { user } = useUser();
  if (!user || !user.email || user.role !== 'ROLE_ADMIN') return null;
  return (
    <a href="/admin" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold">Admin Dashboard</a>
  );
}
