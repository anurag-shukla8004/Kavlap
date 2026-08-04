'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminFetch, AdminApiError } from '@/lib/admin/api';
import type { AdminBooking, ContactRow } from '@/lib/admin/types';

function buildContacts(bookings: AdminBooking[]): ContactRow[] {
  const map = new Map<string, ContactRow>();

  for (const booking of bookings) {
    const phone = booking.customerPhone.trim();
    if (!phone) continue;
    const existing = map.get(phone);
    const slotDate = booking.timeSlot.slotDate;
    if (!existing) {
      map.set(phone, {
        key: phone,
        name: booking.customerName,
        phone,
        email: booking.user.email,
        address: booking.serviceAddress,
        pincode: booking.servicePincode,
        bookingsCount: 1,
        lastBookingDate: slotDate,
      });
      continue;
    }
    existing.bookingsCount += 1;
    if (slotDate > existing.lastBookingDate) {
      existing.lastBookingDate = slotDate;
      existing.name = booking.customerName;
      existing.address = booking.serviceAddress;
      existing.pincode = booking.servicePincode;
      existing.email = booking.user.email;
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    b.lastBookingDate.localeCompare(a.lastBookingDate),
  );
}

export default function ContactsClient() {
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [search, setSearch] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminFetch<AdminBooking[]>('/api/admin/bookings')
      .then((data) => {
        if (!cancelled) setContacts(buildContacts(data));
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof AdminApiError ? err.message : 'Failed to load contacts');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const pincodes = useMemo(
    () => Array.from(new Set(contacts.map((c) => c.pincode))).sort(),
    [contacts],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((contact) => {
      if (pincode && contact.pincode !== pincode) return false;
      if (!q) return true;
      return (
        contact.name.toLowerCase().includes(q) ||
        contact.phone.includes(q) ||
        (contact.email ?? '').toLowerCase().includes(q)
      );
    });
  }, [contacts, search, pincode]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Contacts</h2>
          <p className="text-sm text-slate-500">
            Stage 4a — unique customers derived from bookings. Upload form comes in 4b.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name / phone / email"
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
          <p className="px-4 py-12 text-center text-sm text-slate-500">No contacts found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Pincode</th>
                  <th className="px-4 py-3 font-medium">Bookings</th>
                  <th className="px-4 py-3 font-medium">Last booking</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact) => (
                  <tr key={contact.key} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">{contact.name}</td>
                    <td className="px-4 py-3">{contact.phone}</td>
                    <td className="px-4 py-3">{contact.email ?? '—'}</td>
                    <td className="px-4 py-3">{contact.pincode}</td>
                    <td className="px-4 py-3">{contact.bookingsCount}</td>
                    <td className="px-4 py-3">{contact.lastBookingDate}</td>
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
