'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { adminFetch, AdminApiError } from '@/lib/admin/api';
import type { AdminReview, ReviewActionResult } from '@/lib/admin/types';

export default function ReviewsClient() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [visibleFilter, setVisibleFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [ratingFilter, setRatingFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminFetch<AdminReview[]>('/api/admin/reviews');
      setReviews(data);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews.filter((review) => {
      if (visibleFilter === 'yes' && !review.isVisible) return false;
      if (visibleFilter === 'no' && review.isVisible) return false;
      if (ratingFilter && review.rating !== Number(ratingFilter)) return false;
      if (!q) return true;
      return (
        review.user.name.toLowerCase().includes(q) ||
        (review.comment ?? '').toLowerCase().includes(q)
      );
    });
  }, [reviews, visibleFilter, ratingFilter, search]);

  const toggleVisible = async (review: AdminReview) => {
    setBusyId(review.id);
    setError('');
    setMessage('');
    try {
      const result = await adminFetch<ReviewActionResult>(
        `/api/admin/reviews/${review.id}`,
        {
          method: 'PATCH',
          body: { isVisible: !review.isVisible },
        },
      );
      setMessage(result.message);
      setReviews((prev) =>
        prev.map((item) =>
          item.id === review.id ? { ...item, isVisible: result.isVisible } : item,
        ),
      );
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Failed to update review');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>
          <p className="text-sm text-slate-500">Moderate visibility of customer reviews</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer / comment"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4A9EFF]"
          />
          <select
            value={visibleFilter}
            onChange={(e) => setVisibleFilter(e.target.value as 'all' | 'yes' | 'no')}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4A9EFF]"
          >
            <option value="all">All visibility</option>
            <option value="yes">Visible</option>
            <option value="no">Hidden</option>
          </select>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4A9EFF]"
          >
            <option value="">All ratings</option>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} stars
              </option>
            ))}
          </select>
        </div>
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

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-[#4A9EFF]" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-slate-500">No reviews found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Rating</th>
                  <th className="px-4 py-3 font-medium">Comment</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Worker</th>
                  <th className="px-4 py-3 font-medium">Booking</th>
                  <th className="px-4 py-3 font-medium">Visible</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((review) => (
                  <tr key={review.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium">{review.rating}/5</td>
                    <td className="max-w-xs px-4 py-3 text-slate-700">
                      {review.comment || '—'}
                    </td>
                    <td className="px-4 py-3">{review.user.name}</td>
                    <td className="px-4 py-3">{review.worker?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/bookings/${review.bookingId}`}
                        className="text-[#4A9EFF] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={busyId === review.id}
                        onClick={() => void toggleVisible(review)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium disabled:opacity-60 ${
                          review.isVisible
                            ? 'bg-green-50 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {review.isVisible ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString()}
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
