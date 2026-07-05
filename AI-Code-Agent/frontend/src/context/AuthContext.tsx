import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import type { UserProfile } from '../types';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/me')
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem('access_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    const response = await api.post('/login', { email, password, remember_me: rememberMe });
    const token = response.data.access_token;
    localStorage.setItem('access_token', token);
    setUser(response.data.user as UserProfile);
  };

  const register = async (payload: RegisterPayload) => {
    const response = await api.post('/register', payload);
    const token = response.data.access_token;
    localStorage.setItem('access_token', token);
    setUser(response.data.user as UserProfile);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
