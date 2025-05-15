"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
        // Silently handle unauthorized state (user not logged in)
      } catch (error) {
        // Only log non-auth related errors
        if (error instanceof Error && !error.message.includes('unauthorized')) {
          console.error('Auth check failed:', error);
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('📝 Login response:', { status: response.status, ok: response.ok });
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    console.log('👤 Setting user data:', data.user);
    setUser(data.user);
    
    console.log('📍 Navigating to dashboard...');
    router.push('/dashboard');
  };

  const signup = async (username: string, email: string, password: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Signup failed');
    }

    router.push('/auth/signin');
  };

  const logout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    setUser(null);
    router.push('/auth/signin');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
