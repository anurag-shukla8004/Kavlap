import { Suspense } from 'react';
import AdminLoginPage from './LoginClient';

export default function AdminLoginRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-[#4A9EFF]" />
        </div>
      }
    >
      <AdminLoginPage />
    </Suspense>
  );
}
