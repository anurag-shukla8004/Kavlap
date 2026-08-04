'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminFetch, AdminApiError } from '@/lib/admin/api';
import {
  clearAdminSession,
  getAdminToken,
  isAdminRole,
  setAdminSession,
} from '@/lib/admin/auth';
import type { AuthSession } from '@/lib/admin/types';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const queryError = searchParams.get('error');
    if (queryError === 'not_admin') {
      setError('This account is not an admin.');
    } else if (queryError) {
      setError(queryError);
    }

    const token = getAdminToken();
    if (!token) {
      setCheckingSession(false);
      return;
    }

    adminFetch<AuthSession['user']>('/api/auth/me')
      .then((user) => {
        if (isAdminRole(user.role)) {
          router.replace('/admin/dashboard');
        } else {
          clearAdminSession();
          setCheckingSession(false);
        }
      })
      .catch(() => {
        clearAdminSession();
        setCheckingSession(false);
      });
  }, [router, searchParams]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const session = await adminFetch<AuthSession>('/api/auth/login', {
        method: 'POST',
        auth: false,
        body: { email, password },
      });

      if (!isAdminRole(session.user.role)) {
        clearAdminSession();
        setError('This account is not an admin.');
        return;
      }

      setAdminSession(session.token, session.user);
      const next = searchParams.get('next') || '/admin/dashboard';
      router.replace(next.startsWith('/admin') ? next : '/admin/dashboard');
    } catch (err) {
      const message =
        err instanceof AdminApiError ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-[#4A9EFF]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <p className="text-2xl font-semibold text-[#4A9EFF]">Kavlap</p>
          <h1 className="mt-2 text-xl font-semibold text-white">Admin Portal</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in with your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-[#4A9EFF]"
              placeholder="admin@kavlap.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-[#4A9EFF]"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#4A9EFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3a8eef] disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
