// src/context/auth.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { register, login, fetchMe } from '@/api/auth';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  register: (email: string, name: string, pass: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // при старте поднимаем токен и пользователя
  useEffect(() => {
    const t = localStorage.getItem('jwt');
    if (t) {
      setToken(t);
      fetchMe(t)
        .then(({ user }) => setUser(user))
        .catch(() => {
          localStorage.removeItem('jwt');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const doRegister = async (email: string, name: string, pass: string) => {
    setLoading(true);
    try {
      await register({ email, name, password: pass });
      // после регистрации можно сразу логинить
      await doLogin(email, pass);
    } catch (err: any) {
      setError(err.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const doLogin = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { token } = await login({ email, password: pass });
      localStorage.setItem('jwt', token);
      setToken(token);
      const { user } = await fetchMe(token);
      setUser(user);
    } catch (err: any) {
      setError(err.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const doLogout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register: doRegister,
        login: doLogin,
        logout: doLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
