'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { adminFetch, AdminApiError } from '@/lib/admin/api';
import {
  clearAdminSession,
  getAdminToken,
  getAdminUser,
  isAdminRole,
  setAdminSession,
} from '@/lib/admin/auth';
import type { AdminUser } from '@/lib/admin/types';

type AuthGuardProps = {
  children: (user: AdminUser) => React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      const token = getAdminToken();
      if (!token) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      const cached = getAdminUser();
      if (cached && isAdminRole(cached.role)) {
        if (!cancelled) {
          setUser(cached);
          setChecking(false);
        }
      }

      try {
        const me = await adminFetch<AdminUser>('/api/auth/me');
        if (!isAdminRole(me.role)) {
          clearAdminSession();
          router.replace('/admin/login?error=not_admin');
          return;
        }
        setAdminSession(token, me);
        if (!cancelled) {
          setUser(me);
          setChecking(false);
        }
      } catch (error) {
        clearAdminSession();
        if (!cancelled) {
          const message =
            error instanceof AdminApiError ? error.message : 'Session expired';
          router.replace(
            `/admin/login?error=${encodeURIComponent(message)}`,
          );
        }
      }
    };

    void verify();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (checking || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-[#4A9EFF]" />
      </div>
    );
  }

  return <>{children(user)}</>;
}
