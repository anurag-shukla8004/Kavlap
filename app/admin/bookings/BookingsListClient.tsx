'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import StatusBadge from '@/components/admin/StatusBadge';
import { adminFetch, AdminApiError } from '@/lib/admin/api';
import {
  BOOKING_STATUSES,
  type AdminBooking,
  type BookingStatus,
} from '@/lib/admin/types';

export default function BookingsListClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = (searchParams.get('status') || '') as BookingStatus | '';
  const dateParam = searchParams.get('date') || '';

  const [status, setStatus] = useState<BookingStatus | ''>(
    BOOKING_STATUSES.includes(statusParam as BookingStatus) ? statusParam : '',
  );
  const [date, setDate] = useState(dateParam);
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setStatus(
      BOOKING_STATUSES.includes(statusParam as BookingStatus) ? statusParam : '',
    );
    setDate(dateParam);
  }, [statusParam, dateParam]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await adminFetch<AdminBooking[]>('/api/admin/bookings', {
          query: {
            status: status || undefined,
            date: date || undefined,
          },
        });
        if (!cancelled) setBookings(data);
      } catch (err) {
        if (!cancelled) {
          setBookings([]);
          setError(err instanceof AdminApiError ? err.message : 'Failed to load bookings');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [status, date]);

  const updateQuery = (nextStatus: string, nextDate: string) => {
    const params = new URLSearchParams();
    if (nextStatus) params.set('status', nextStatus);
    if (nextDate) params.set('date', nextDate);
    const qs = params.toString();
    router.replace(qs ? `/admin/bookings?${qs}` : '/admin/bookings');
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter(
      (b) =>
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        (b.user.email ?? '').toLowerCase().includes(q),
    );
  }, [bookings, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Bookings</h2>
          <p className="text-sm text-slate-500">
            Confirm, reject, and assign workers to wash requests
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name / phone"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4A9EFF]"
          />
          <select
            value={status}
            onChange={(e) => {
              const value = e.target.value as BookingStatus | '';
              setStatus(value);
              updateQuery(value, date);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4A9EFF]"
          >
            <option value="">All statuses</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              updateQuery(status, e.target.value);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4A9EFF]"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-[#4A9EFF]" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-slate-500">No bookings found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Package</th>
                  <th className="px-4 py-3 font-medium">Slot</th>
                  <th className="px-4 py-3 font-medium">Pincode</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Worker</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="font-medium text-[#4A9EFF] hover:underline"
                      >
                        {booking.customerName}
                      </Link>
                      <p className="text-xs text-slate-500">{booking.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{booking.package.name}</td>
                    <td className="px-4 py-3 text-slate-700">
                      <div>{booking.timeSlot.slotDate}</div>
                      <div className="text-xs text-slate-500">
                        {booking.timeSlot.startTime}–{booking.timeSlot.endTime}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{booking.servicePincode}</td>
                    <td className="px-4 py-3 text-slate-700">₹{booking.totalPrice}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {booking.worker?.name ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
