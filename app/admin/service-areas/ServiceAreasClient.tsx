'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminFetch, AdminApiError } from '@/lib/admin/api';
import type { ServiceArea } from '@/lib/admin/types';

export default function ServiceAreasClient() {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminFetch<ServiceArea[]>('/api/service-areas', { auth: false })
      .then((data) => {
        if (!cancelled) setAreas(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof AdminApiError ? err.message : 'Failed to load service areas');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return areas;
    return areas.filter(
      (area) =>
        area.pincode.includes(q) ||
        area.city.toLowerCase().includes(q) ||
        area.areaName.toLowerCase().includes(q),
    );
  }, [areas, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Service areas</h2>
          <p className="text-sm text-slate-500">
            Stage 6a — read-only list of active pincodes
          </p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pincode / city / area"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4A9EFF]"
        />
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
          <p className="px-4 py-12 text-center text-sm text-slate-500">No service areas found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Pincode</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">Area</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((area) => (
                  <tr key={area.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium">{area.pincode}</td>
                    <td className="px-4 py-3">{area.city}</td>
                    <td className="px-4 py-3">{area.areaName}</td>
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
