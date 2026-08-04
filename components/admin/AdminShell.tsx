'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AuthGuard from '@/components/admin/AuthGuard';
import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/admin/TopBar';
import { clearAdminSession } from '@/lib/admin/auth';
import { ADMIN_NAV } from '@/lib/admin/nav';

type AdminShellProps = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = useMemo(() => {
    const match = ADMIN_NAV.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    );
    return match?.label ?? 'Admin';
  }, [pathname]);

  const handleLogout = () => {
    clearAdminSession();
    router.replace('/admin/login');
  };

  return (
    <AuthGuard>
      {(user) => (
        <div className="flex min-h-screen bg-slate-100 text-slate-900">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar
              user={user}
              title={title}
              onMenuClick={() => setSidebarOpen(true)}
              onLogout={handleLogout}
            />
            <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
