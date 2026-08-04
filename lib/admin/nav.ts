export type AdminNavItem = {
  href: string;
  label: string;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/slots', label: 'Slots' },
  { href: '/admin/contacts', label: 'Contacts' },
  { href: '/admin/workers', label: 'Workers' },
  { href: '/admin/service-areas', label: 'Service Areas' },
  { href: '/admin/packages', label: 'Packages' },
  { href: '/admin/reviews', label: 'Reviews' },
];
