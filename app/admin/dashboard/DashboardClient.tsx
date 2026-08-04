'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from '@/components/admin/dashboard/StatCard';
import StatusChart from '@/components/admin/dashboard/StatusChart';
import { adminFetch, AdminApiError } from '@/lib/admin/api';
import type { AdminDashboardStats } from '@/lib/admin/types';

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function DashboardClient() {
  const [date, setDate] = useState(todayIso);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await adminFetch<AdminDashboardStats>('/api/admin/dashboard', {
          query: { date },
        });
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          setStats(null);
          setError(err instanceof AdminApiError ? err.message : 'Failed to load dashboard');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [date]);

  const chartItems = stats
    ? [
        { label: 'Pending review', value: stats.pendingReview, color: '#f59e0b' },
        { label: 'Confirmed', value: stats.confirmed, color: '#4A9EFF' },
        { label: 'Assigned', value: stats.assigned, color: '#8b5cf6' },
        { label: 'In progress', value: stats.inProgress, color: '#06b6d4' },
        { label: 'Completed (day)', value: stats.completedToday, color: '#22c55e' },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
          <p className="text-sm text-slate-500">Live booking stats from kavlap-server</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-[#4A9EFF]"
          />
        </label>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading && !stats ? (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-[#4A9EFF]" />
        </div>
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Pending review"
              value={stats.pendingReview}
              href="/admin/bookings?status=PENDING_REVIEW"
              accent="border-amber-200"
            />
            <StatCard
              label="Confirmed"
              value={stats.confirmed}
              href="/admin/bookings?status=CONFIRMED"
              accent="border-sky-200"
            />
            <StatCard
              label="Assigned"
              value={stats.assigned}
              href="/admin/bookings?status=ASSIGNED"
              accent="border-violet-200"
            />
            <StatCard
              label="In progress"
              value={stats.inProgress}
              href="/admin/bookings?status=IN_PROGRESS"
              accent="border-cyan-200"
            />
            <StatCard
              label="Completed today"
              value={stats.completedToday}
              href="/admin/bookings?status=COMPLETED"
              accent="border-green-200"
            />
            <StatCard
              label="Total bookings"
              value={stats.totalBookings}
              href="/admin/bookings"
              accent="border-slate-200"
            />
          </div>

          <StatusChart items={chartItems} />

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Quick links</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href="/admin/bookings?status=PENDING_REVIEW"
                className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
              >
                Review pending bookings
              </Link>
              <Link
                href="/admin/slots"
                className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Check time slots
              </Link>
              <Link
                href="/admin/workers"
                className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                View workers
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
