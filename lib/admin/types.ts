export type AdminUser = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  profileImageUrl: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
};

export type AuthSession = {
  user: AdminUser;
  token: string;
  expiresIn: string;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  status: 'error';
  message: string;
};

export type AdminDashboardStats = {
  date: string;
  pendingReview: number;
  confirmed: number;
  assigned: number;
  inProgress: number;
  completedToday: number;
  totalBookings: number;
};

export type BookingStatus =
  | 'PENDING_REVIEW'
  | 'CONFIRMED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export type CarType = 'HATCHBACK' | 'SEDAN' | 'SUV' | 'LUXURY';

export type Seater = 'FIVE' | 'SEVEN';

export type AdminBooking = {
  id: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  serviceAddress: string;
  servicePincode: string;
  carType: CarType;
  seater: Seater;
  carModel: string;
  carNumberPlate: string;
  specialInstructions: string | null;
  cancellationReason: string | null;
  rejectionReason: string | null;
  confirmedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  package: {
    id: string;
    name: string;
    durationMinutes: number;
  };
  timeSlot: {
    id: string;
    slotDate: string;
    startTime: string;
    endTime: string;
  };
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
  worker: {
    id: string;
    employeeCode: string;
    name: string;
    phone: string;
  } | null;
};

export type AdminWorker = {
  id: string;
  employeeCode: string;
  name: string;
  phone: string;
  isAvailable: boolean;
  servicePincodes: string[];
};

export type AdminActionResult = {
  id: string;
  status: BookingStatus;
  message: string;
};

export type ServiceArea = {
  id: string;
  pincode: string;
  city: string;
  areaName: string;
};

export type TimeSlot = {
  id: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  bookedCount: number;
  availableSpots: number;
  isAvailable: boolean;
};

export type PackageSummary = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  basePrice: number;
  durationMinutes: number;
  features: string[];
};

export type PackagePricing = {
  id: string;
  carType: CarType;
  seater: Seater;
  price: number;
};

export type PackageDetail = PackageSummary & {
  pricing: PackagePricing[];
};

export type AdminReview = {
  id: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  isVisible: boolean;
  createdAt: string;
  user: { id: string; name: string };
  worker: { id: string; name: string } | null;
};

export type ReviewActionResult = {
  id: string;
  isVisible: boolean;
  message: string;
};

export type ContactRow = {
  key: string;
  name: string;
  phone: string;
  email: string | null;
  address: string;
  pincode: string;
  bookingsCount: number;
  lastBookingDate: string;
};

export const BOOKING_STATUSES: BookingStatus[] = [
  'PENDING_REVIEW',
  'CONFIRMED',
  'ASSIGNED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'REJECTED',
];
