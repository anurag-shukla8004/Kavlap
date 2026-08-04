import type { BookingStatus } from '@/lib/admin/types';

const STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING_REVIEW: 'bg-amber-50 text-amber-800 border-amber-200',
  CONFIRMED: 'bg-sky-50 text-sky-800 border-sky-200',
  ASSIGNED: 'bg-violet-50 text-violet-800 border-violet-200',
  IN_PROGRESS: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  COMPLETED: 'bg-green-50 text-green-800 border-green-200',
  CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

export function statusLabel(status: BookingStatus): string {
  return status.replaceAll('_', ' ');
}

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}
