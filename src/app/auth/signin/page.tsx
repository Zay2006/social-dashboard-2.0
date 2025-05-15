'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';

export default function SignIn() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('📝 Login response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Sign in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-white mb-6">Sign In</h1>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-gray-400 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
