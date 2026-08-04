'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';
import { adminFetch, AdminApiError } from '@/lib/admin/api';
import type {
  AdminActionResult,
  AdminBooking,
  AdminWorker,
} from '@/lib/admin/types';

type Props = {
  bookingId: string;
};

export default function BookingDetailClient({ bookingId }: Props) {
  const [booking, setBooking] = useState<AdminBooking | null>(null);
  const [workers, setWorkers] = useState<AdminWorker[]>([]);
  const [workerId, setWorkerId] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [bookingData, workersData] = await Promise.all([
        adminFetch<AdminBooking>(`/api/admin/bookings/${bookingId}`),
        adminFetch<AdminWorker[]>('/api/admin/workers'),
      ]);
      setBooking(bookingData);
      setWorkers(workersData);
    } catch (err) {
      setBooking(null);
      setError(err instanceof AdminApiError ? err.message : 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (fn: () => Promise<AdminActionResult>) => {
    setActionLoading(true);
    setError('');
    setMessage('');
    try {
      const result = await fn();
      setMessage(result.message);
      await load();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirm = () =>
    runAction(() =>
      adminFetch<AdminActionResult>(`/api/admin/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
      }),
    );

  const handleReject = (event: FormEvent) => {
    event.preventDefault();
    void runAction(() =>
      adminFetch<AdminActionResult>(`/api/admin/bookings/${bookingId}/reject`, {
        method: 'PATCH',
        body: { rejectionReason },
      }),
    );
  };

  const handleAssign = (event: FormEvent) => {
    event.preventDefault();
    void runAction(() =>
      adminFetch<AdminActionResult>(
        `/api/admin/bookings/${bookingId}/assign-worker`,
        {
          method: 'POST',
          body: { workerId },
        },
      ),
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-[#4A9EFF]" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || 'Booking not found'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/bookings" className="text-sm text-[#4A9EFF] hover:underline">
            ← Back to bookings
          </Link>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {booking.customerName}
          </h2>
          <div className="mt-2">
            <StatusBadge status={booking.status} />
          </div>
        </div>
        <p className="text-sm text-slate-500">
          Created {new Date(booking.createdAt).toLocaleString()}
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Customer</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Name</dt>
              <dd>{booking.customerName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Phone</dt>
              <dd>{booking.customerPhone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Account email</dt>
              <dd>{booking.user.email ?? '—'}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Service</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Package</dt>
              <dd>{booking.package.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Price</dt>
              <dd>₹{booking.totalPrice}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Address</dt>
              <dd className="text-right">{booking.serviceAddress}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Pincode</dt>
              <dd>{booking.servicePincode}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Instructions</dt>
              <dd className="text-right">{booking.specialInstructions ?? '—'}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Vehicle</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Type</dt>
              <dd>
                {booking.carType} / {booking.seater}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Model</dt>
              <dd>{booking.carModel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Number plate</dt>
              <dd>{booking.carNumberPlate}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Slot & worker</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Date</dt>
              <dd>{booking.timeSlot.slotDate}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Time</dt>
              <dd>
                {booking.timeSlot.startTime}–{booking.timeSlot.endTime}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Worker</dt>
              <dd>
                {booking.worker
                  ? `${booking.worker.name} (${booking.worker.employeeCode})`
                  : '—'}
              </dd>
            </div>
            {booking.rejectionReason ? (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Rejection</dt>
                <dd className="text-right text-red-600">{booking.rejectionReason}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      </div>

      {booking.status === 'PENDING_REVIEW' ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => void handleConfirm()}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              Confirm booking
            </button>
          </div>
          <form onSubmit={handleReject} className="mt-4 space-y-3">
            <label className="block text-sm text-slate-600">
              Rejection reason
              <textarea
                required
                minLength={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#4A9EFF]"
                rows={3}
                placeholder="Slot unavailable due to rain"
              />
            </label>
            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              Reject booking
            </button>
          </form>
        </section>
      ) : null}

      {booking.status === 'CONFIRMED' ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Assign worker</h3>
          <form onSubmit={handleAssign} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <select
              required
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#4A9EFF]"
            >
              <option value="">Select worker</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name} ({worker.employeeCode})
                  {worker.isAvailable ? '' : ' — unavailable'}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={actionLoading || !workerId}
              className="rounded-lg bg-[#4A9EFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3a8eef] disabled:opacity-60"
            >
              Assign
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
