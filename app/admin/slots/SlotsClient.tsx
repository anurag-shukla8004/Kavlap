'use client';

import { useEffect, useState } from 'react';
import { adminFetch, AdminApiError } from '@/lib/admin/api';
import type { ServiceArea, TimeSlot } from '@/lib/admin/types';

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function SlotsClient() {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [pincode, setPincode] = useState('');
  const [date, setDate] = useState(todayIso);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminFetch<ServiceArea[]>('/api/service-areas', { auth: false })
      .then((data) => {
        if (cancelled) return;
        setAreas(data);
        if (data[0]) setPincode(data[0].pincode);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof AdminApiError ? err.message : 'Failed to load areas');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingAreas(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!pincode || !date) return;
    let cancelled = false;
    setLoadingSlots(true);
    setError('');
    adminFetch<TimeSlot[]>('/api/time-slots', {
      auth: false,
      query: { pincode, date },
    })
      .then((data) => {
        if (!cancelled) setSlots(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setSlots([]);
          setError(err instanceof AdminApiError ? err.message : 'Failed to load slots');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pincode, date]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Time slots</h2>
          <p className="text-sm text-slate-500">
            Read-only capacity view (Stage 3a). Create/edit comes after admin slot APIs.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={pincode}
            disabled={loadingAreas}
            onChange={(e) => setPincode(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4A9EFF]"
          >
            {areas.length === 0 ? <option value="">No areas</option> : null}
            {areas.map((area) => (
              <option key={area.id} value={area.pincode}>
                {area.pincode} — {area.areaName}, {area.city}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
        {loadingSlots ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-[#4A9EFF]" />
          </div>
        ) : slots.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-slate-500">
            No available slots for this pincode and date
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Capacity</th>
                  <th className="px-4 py-3 font-medium">Booked</th>
                  <th className="px-4 py-3 font-medium">Available</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => {
                  const full = slot.availableSpots <= 0;
                  return (
                    <tr key={slot.id} className="border-b border-slate-100">
                      <td className="px-4 py-3">
                        {slot.startTime}–{slot.endTime}
                      </td>
                      <td className="px-4 py-3">{slot.maxCapacity}</td>
                      <td className="px-4 py-3">{slot.bookedCount}</td>
                      <td className="px-4 py-3">{slot.availableSpots}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            full
                              ? 'bg-red-50 text-red-700'
                              : 'bg-green-50 text-green-700'
                          }`}
                        >
                          {full ? 'Full' : 'Open'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
