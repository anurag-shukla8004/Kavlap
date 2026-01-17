import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase credentials missing!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BookingData {
  id?: string;
  full_name: string;
  phone_number: string;
  email: string;
  address: string;
  landmark?: string;
  pincode: string;
  car_type: string;
  package_type: string;
  package_price: number;
  booking_date: string;
  booking_time: string;
  is_read?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Create new booking
export const createBooking = async (bookingData: BookingData) => {
  try {
    const { data, error } = await supabase
      .from('user_booking')
      .insert([bookingData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    console.log('✅ Booking created:', data);
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
};

// Get all bookings (for users)
export const getBookings = async () => {
  try {
    const { data, error } = await supabase
      .from('user_booking')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Admin: Get all bookings with sorting (unread first, then by date)
export const getAdminBookings = async () => {
  try {
    const { data, error } = await supabase
      .from('user_booking')
      .select('*')
      .order('is_read', { ascending: true })  // Unread first
      .order('created_at', { ascending: false });  // Latest first

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    throw error;
  }
};

// Admin: Mark booking as read
export const markBookingAsRead = async (bookingId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_booking')
      .update({ is_read: true })
      .eq('id', bookingId)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error marking booking as read:', error);
    throw error;
  }
};

// Admin: Get bookings by date
export const getBookingsByDate = async (date: string) => {
  try {
    const { data, error } = await supabase
      .from('user_booking')
      .select('*')
      .eq('booking_date', date)
      .order('is_read', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching bookings by date:', error);
    throw error;
  }
};

// Admin: Search bookings
export const searchBookings = async (query: string) => {
  try {
    const { data, error } = await supabase
      .from('user_booking')
      .select('*')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone_number.ilike.%${query}%`)
      .order('is_read', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error searching bookings:', error);
    throw error;
  }
};