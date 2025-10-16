// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
 
        throw new Error(data.error || 'Login failed');
      }
    // Redirect based on user role
      router.push(`/dashboard/${data.user.role}`);
    } catch (err) {
      
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-white flex flex-col lg:flex-row items-center justify-center p-4 space-x-20">
        
 
        {/* Header */}
        <div className="text-center bg-white p-8 py-30 rounded-2xl shadow-2xl mb-10 lg:mb-0 lg:flex-grow">
          <h1 className="text-4xl lg:text-7xl font-extrabold text-indigo-300 mb-2 text-shadow-md">Welcome Back</h1>
          <p className="text-indigo-400 font-light">Sign in to your retail account</p>
        </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">  
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            ERROR: {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-indigo-400 mb-2">
              Username
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-transparent transition outline-none"
              placeholder="Enter your username"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-indigo-400 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-transparent transition outline-none"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-400 text-white py-3 rounded-lg font-semibold hover:bg-indigo-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-700 font-semibold hover:text-blue-400 transition">
            Register here
          </Link>
        </div>
      </div>
      </div>

  );
}