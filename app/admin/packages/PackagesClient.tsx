'use client';

import { useEffect, useState } from 'react';
import { adminFetch, AdminApiError } from '@/lib/admin/api';
import type { PackageDetail, PackageSummary } from '@/lib/admin/types';

export default function PackagesClient() {
  const [packages, setPackages] = useState<PackageSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminFetch<PackageSummary[]>('/api/packages', { auth: false })
      .then((data) => {
        if (cancelled) return;
        setPackages(data);
        if (data[0]) setSelectedId(data[0].id);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof AdminApiError ? err.message : 'Failed to load packages');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    adminFetch<PackageDetail>(`/api/packages/${selectedId}`, { auth: false })
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setDetail(null);
          setError(err instanceof AdminApiError ? err.message : 'Failed to load package');
        }
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Packages</h2>
        <p className="text-sm text-slate-500">
          Stage 7a — read-only packages and pricing matrix
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-[#4A9EFF]" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {packages.map((pkg) => (
                <li key={pkg.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(pkg.id)}
                    className={`w-full px-4 py-3 text-left text-sm transition ${
                      selectedId === pkg.id
                        ? 'bg-[#4A9EFF]/10 text-[#4A9EFF]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <p className="font-medium">{pkg.name}</p>
                    <p className="text-xs text-slate-500">
                      ₹{pkg.basePrice} · {pkg.durationMinutes} min
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            {detailLoading || !detail ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#4A9EFF]" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{detail.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {detail.description || 'No description'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Features</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                    {(detail.features ?? []).map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Pricing matrix</h4>
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="border-b border-slate-200 text-slate-500">
                        <tr>
                          <th className="px-2 py-2 font-medium">Car type</th>
                          <th className="px-2 py-2 font-medium">Seater</th>
                          <th className="px-2 py-2 font-medium">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(detail.pricing ?? []).map((row) => (
                          <tr key={row.id} className="border-b border-slate-100">
                            <td className="px-2 py-2">{row.carType}</td>
                            <td className="px-2 py-2">{row.seater}</td>
                            <td className="px-2 py-2">₹{row.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
