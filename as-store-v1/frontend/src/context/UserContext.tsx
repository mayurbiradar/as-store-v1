import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getMe } from '../api/authApi';

interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setUser(null);
        return;
      }
      try {
        // Set Authorization header for API instance if not already set
        const { API } = await import('../api/authApi');
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        const res = await getMe();
        const parsed = res.data;
        // Normalize role for UI
        if (parsed.role === 'ROLE_ADMIN') parsed.role = 'admin';
        else if (parsed.role === 'ROLE_USER') parsed.role = 'user';
        setUser(parsed);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    // Call backend logout and clear tokens
    const { handleLogout } = await import('../utils/authUtils');
    await handleLogout();
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
