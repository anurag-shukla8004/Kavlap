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
