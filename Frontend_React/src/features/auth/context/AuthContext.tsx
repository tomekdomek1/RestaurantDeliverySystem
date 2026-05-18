import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { API_BASE_URL } from '../../../config/api';

export interface User {
  id?: string;
  email: string;
  fullName?: string;
  roles: string[];
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthResponseUser {
  id?: string;
  email: string;
  fullName?: string;
  roles?: string[];
}

interface AuthResponse {
  user?: AuthResponseUser;
  token?: string | null;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isDevEnv = import.meta.env.DEV;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isDevEnv) {
      return;
    }

    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (!token || !userStr) {
      return;
    }

    try {
      const restoredUser = JSON.parse(userStr) as User;
      setUser(restoredUser);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to restore auth from localStorage', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }, [isDevEnv]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json() as AuthResponse;
      const userData: User = {
        id: data.user?.id,
        email: data.user?.email ?? email,
        fullName: data.user?.fullName,
        roles: data.user?.roles ?? [],
      };

      if (isDevEnv && data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      }

      setIsLoggedIn(true);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  }, [isDevEnv]);

  const register = useCallback(async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, fullName }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json() as AuthResponse;
      const userData: User = {
        id: data.user?.id,
        email: data.user?.email ?? email,
        fullName: data.user?.fullName ?? fullName,
        roles: data.user?.roles ?? [],
      };

      if (isDevEnv && data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      }

      setIsLoggedIn(true);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  }, [isDevEnv]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/Auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setIsLoggedIn(false);
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
