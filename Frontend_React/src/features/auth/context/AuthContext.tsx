import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { API_BASE_URL } from '../../../config/api';
import { getUidFromToken } from '../../../utils/jwt';

export interface User {
  id?: string;
  email: string;
  fullName?: string;
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setIsLoggedIn(true);
        setUser(userData);
      } catch (err) {
        console.error('Failed to restore auth from localStorage', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

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

      const data = await response.json();
      const userData: User = { email };
      
      // Store token in localStorage for fallback (when cookies don't work)
      if (data.token) {
        // Extract user ID from token
        const uid = getUidFromToken(data.token);
        if (uid) {
          userData.id = uid;
        }
        
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      }

      setIsLoggedIn(true);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  }, []);

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

      const data = await response.json();
      const userData: User = { email, fullName };
      
      // Store token in localStorage for fallback (when cookies don't work)
      if (data.token) {
        // Extract user ID from token
        const uid = getUidFromToken(data.token);
        if (uid) {
          userData.id = uid;
        }
        
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      }

      setIsLoggedIn(true);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/Auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } finally {
      // Clear both cookie and localStorage
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
