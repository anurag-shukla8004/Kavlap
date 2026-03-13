'use client';

import React, { useState, useEffect } from 'react';
import { BookingData, getAdminBookings, markBookingAsRead, supabase } from '@/lib/supabase';

// Simple SVG Icons
const Icons = {
  Search: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Close: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Phone: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Mail: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  MapPin: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Car: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  Calendar: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clock: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Circle: ({ filled, className }: { filled: boolean; className?: string }) => (
    <svg className={className} viewBox="0 0 24 24">
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

  // Auth states
  const [authState, setAuthState] = useState({ isLoggedIn: false, mounted: false });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Check localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthState({ isLoggedIn: loggedIn, mounted: true });
  }, []);

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

    if (authState.isLoggedIn) {
      fetchBookings();
    }
  }, [authState.isLoggedIn]);

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

    // Sort: unread first, then by created_at desc
    filtered.sort((a, b) => {
      if (a.is_read !== b.is_read) {
        return a.is_read ? 1 : -1;
      }
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    });

    return filtered;
  }, [bookings, dateFilter, searchQuery]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    console.log('Attempting login with email:', email);
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email);
      console.log('Query result - data:', data, 'error:', error);
      if (error) {
        console.error('Query error:', error);
        alert('Login failed');
        setLoginLoading(false);
        return;
      }
      if (!data || data.length === 0) {
        alert('Invalid email or password');
        setLoginLoading(false);
        return;
      }
      const user = data[0];
      console.log('Found user:', user);
      if (user.password === password) {
        localStorage.setItem('adminLoggedIn', 'true');
        setAuthState(prev => ({ ...prev, isLoggedIn: true }));
      } else {
        alert('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed');
    }
    setLoginLoading(false);
  };

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

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const unreadCount = bookings.filter(b => !b.is_read).length;

  if (!authState.mounted) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center" suppressHydrationWarning={true}>Loading...</div>;
  }

  if (!authState.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center" suppressHydrationWarning={true}>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <img src="/KAVLAP.svg" alt="Kavlap Logo" className="mx-auto h-16 w-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-white mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loginLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning={true}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
            <button
              onClick={() => {
                localStorage.removeItem('adminLoggedIn');
                setAuthState(prev => ({ ...prev, isLoggedIn: false }));
                setEmail('');
                setPassword('');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          <div className="flex gap-3">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Total: {bookings.length}</span>
            </div>
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Unread: {unreadCount}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icons.Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <li
                key={booking.id}
                onClick={() => handleBookingClick(booking)}
                className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${!booking.is_read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icons.Circle filled={!booking.is_read} />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{booking.full_name}</p>
                      <p className="text-sm text-gray-500">{booking.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{formatDate(booking.booking_date)}</p>
                    <p className="text-sm text-gray-500">{formatTime(booking.booking_time)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {filteredBookings.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No bookings found
            </div>
          )}
        </div>

        {/* Booking Details Dialog */}
        {openDialog && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
                <button onClick={handleCloseDialog} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <Icons.Close className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.full_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.phone_number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Landmark</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.landmark || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pincode</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.pincode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Car Type</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.car_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Package</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.package_type} - ₹{selectedBooking.package_price}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Booking Date</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedBooking.booking_date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Booking Time</label>
                    <p className="mt-1 text-sm text-gray-900">{formatTime(selectedBooking.booking_time)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}