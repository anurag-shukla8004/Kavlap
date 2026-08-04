import { Suspense } from 'react';
import BookingsListClient from './BookingsListClient';

export default function AdminBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-[#4A9EFF]" />
        </div>
      }
    >
      <BookingsListClient />
    </Suspense>
  );
}
