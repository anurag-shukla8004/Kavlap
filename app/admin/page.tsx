'use client';

import React, { useState, useEffect } from 'react';
import { BookingData, getAdminBookings, markBookingAsRead } from '@/lib/supabase';

// Simple SVG Icons
const Icons = {
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Car: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Circle: ({ filled }: { filled: boolean }) => (
    <svg className="w-3 h-3" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} />
    </svg>
  )
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

   useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getAdminBookings();
        setBookings(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);


  // ✅ SOLUTION: Use useMemo instead of useEffect for filtering
  const filteredBookings = React.useMemo(() => {
    let filtered = [...bookings];

    if (dateFilter) {
      filtered = filtered.filter(b => b.booking_date === dateFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.full_name.toLowerCase().includes(query) ||
        b.email.toLowerCase().includes(query) ||
        b.phone_number.includes(query)
      );
    }

    filtered.sort((a, b) => {
      if (a.is_read === b.is_read) {
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
      return a.is_read ? 1 : -1;
    });

    return filtered;
  }, [bookings, dateFilter, searchQuery]);

  const handleBookingClick = async (booking: BookingData) => {
    setSelectedBooking(booking);
    setOpenDialog(true);

    if (!booking.is_read && booking.id) {
      try {
        await markBookingAsRead(booking.id);
        setBookings(prev =>
          prev.map(b => b.id === booking.id ? { ...b, is_read: true } : b)
        );
      } catch (err) {
        console.error('Error updating booking:', err);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const unreadCount = bookings.filter(b => !b.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Management</h1>
          <div className="flex gap-3">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Total: {bookings.length}</span>
            </div>
            <div className="bg-orange-500 text-white px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Unread: {unreadCount}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-3 py-3"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      onClick={() => handleBookingClick(booking)}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                        !booking.is_read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-3 py-4">
                        <div className={booking.is_read ? 'text-gray-300' : 'text-green-500'}>
                          <Icons.Circle filled={!booking.is_read} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${booking.is_read ? 'font-normal' : 'font-bold'} text-gray-900`}>
                          {booking.full_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.phone_number}</div>
                        <div className="text-xs text-gray-500">{booking.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.car_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.package_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(booking.booking_date)}</div>
                        <div className="text-xs text-gray-500">{booking.booking_time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-green-600">₹{booking.package_price}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dialog */}
      {openDialog && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
              <button
                onClick={handleCloseDialog}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icons.Close />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedBooking.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Icons.Phone />
                    <span className="font-medium text-gray-900">{selectedBooking.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Icons.Mail />
                    <span className="font-medium text-gray-900">{selectedBooking.email}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Address</h3>
                <div className="pl-4">
                  <div className="flex gap-2">
                    <div className="text-gray-400 mt-0.5">
                      <Icons.MapPin />
                    </div>
                    <div>
                      <p className="font-medium">{selectedBooking.address}</p>
                      {selectedBooking.landmark && (
                        <p className="text-sm text-gray-600 mt-1">Landmark: {selectedBooking.landmark}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">Pincode: {selectedBooking.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Details</h3>
                  <div className="pl-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Icons.Car />
                      <span className="font-medium text-gray-900">{selectedBooking.car_type}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Package: {selectedBooking.package_type}
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      ₹{selectedBooking.package_price}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Scheduled Time</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 text-blue-600">
                      <Icons.Calendar />
                      <span className="font-semibold text-blue-900">
                        {formatDate(selectedBooking.booking_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                      <Icons.Clock />
                      <span className="text-blue-800">{selectedBooking.booking_time}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
                <div>Created: {formatDate(selectedBooking.created_at)}</div>
                <div>Updated: {formatDate(selectedBooking.updated_at)}</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={handleCloseDialog}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}