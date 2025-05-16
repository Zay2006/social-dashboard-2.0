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
        console.log('🔄 Checking authentication status...');
        const response = await fetch('/api/auth/me', {
          credentials: 'include' // Important: include cookies in the request
        });

        console.log('🔑 Auth check response:', {
          status: response.status,
          ok: response.ok
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('👤 User data received:', userData);
          setUser(userData);
        } else {
          console.log('❌ Not authenticated');
          setUser(null);
        }
      } catch (error) {
        console.error('🚫 Auth check failed:', error);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔑 Attempting login...');
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        credentials: 'include', // Important: include cookies in the request
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📝 Login response:', {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers)
      });
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('👤 Setting user data:', data.user);
      setUser(data.user);
      
      // Check if authentication is working
      const authCheck = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      console.log('🔒 Auth check after login:', {
        status: authCheck.status,
        ok: authCheck.ok
      });

      console.log('📍 Navigating to dashboard...');
      router.push('/dashboard');
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      console.log('📝 Attempting signup...');
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      console.log('✉️ Signup response:', {
        status: response.status,
        ok: response.ok
      });

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      console.log('✅ Signup successful, redirecting to signin...');
      router.push('/auth/signin');
    } catch (error) {
      console.error('❌ Signup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      });
      console.log('👋 Logout successful');
      setUser(null);
      router.push('/auth/signin');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Still clear the user state and redirect even if the API call fails
      setUser(null);
      router.push('/auth/signin');
    }
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
