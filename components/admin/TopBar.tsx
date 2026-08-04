'use client';

import type { AdminUser } from '@/lib/admin/types';

type TopBarProps = {
  user: AdminUser | null;
  title?: string;
  onMenuClick: () => void;
  onLogout: () => void;
};

export default function TopBar({ user, title, onMenuClick, onLogout }: TopBarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 lg:hidden"
          aria-label="Open menu"
        >
          Menu
        </button>
        {title ? (
          <h1 className="text-base font-semibold text-slate-900 lg:text-lg">{title}</h1>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{user?.name ?? 'Admin'}</p>
          <p className="text-xs text-slate-500">{user?.email ?? ''}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
