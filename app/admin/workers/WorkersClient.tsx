'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminFetch, AdminApiError } from '@/lib/admin/api';
import type { AdminWorker } from '@/lib/admin/types';

export default function WorkersClient() {
  const [workers, setWorkers] = useState<AdminWorker[]>([]);
  const [search, setSearch] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminFetch<AdminWorker[]>('/api/admin/workers')
      .then((data) => {
        if (!cancelled) setWorkers(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof AdminApiError ? err.message : 'Failed to load workers');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const pincodes = useMemo(() => {
    const set = new Set<string>();
    workers.forEach((worker) => {
      (worker.servicePincodes ?? []).forEach((code) => set.add(String(code)));
    });
    return Array.from(set).sort();
  }, [workers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return workers.filter((worker) => {
      if (availableOnly && !worker.isAvailable) return false;
      if (pincode && !(worker.servicePincodes ?? []).map(String).includes(pincode)) {
        return false;
      }
      if (!q) return true;
      return (
        worker.name.toLowerCase().includes(q) ||
        worker.employeeCode.toLowerCase().includes(q) ||
        worker.phone.includes(q)
      );
    });
  }, [workers, search, availableOnly, pincode]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Workers</h2>
          <p className="text-sm text-slate-500">Used for booking assignment</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name / code / phone"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4A9EFF]"
          />
          <select
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4A9EFF]"
          >
            <option value="">All pincodes</option>
            {pincodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />
            Available only
          </label>
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
          <p className="px-4 py-12 text-center text-sm text-slate-500">No workers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Available</th>
                  <th className="px-4 py-3 font-medium">Service pincodes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((worker) => (
                  <tr key={worker.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium">{worker.employeeCode}</td>
                    <td className="px-4 py-3">{worker.name}</td>
                    <td className="px-4 py-3">{worker.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          worker.isAvailable
                            ? 'bg-green-50 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {worker.isAvailable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(worker.servicePincodes ?? []).map((code) => (
                          <span
                            key={`${worker.id}-${code}`}
                            className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                          >
                            {String(code)}
                          </span>
                        ))}
                      </div>
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
