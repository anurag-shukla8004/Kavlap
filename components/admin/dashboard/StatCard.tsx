'use client';

import Link from 'next/link';

type StatCardProps = {
  label: string;
  value: number;
  href?: string;
  accent?: string;
};

export default function StatCard({
  label,
  value,
  href,
  accent = 'border-slate-200',
}: StatCardProps) {
  const content = (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md ${accent}`}
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
