'use client';

type ChartItem = {
  label: string;
  value: number;
  color: string;
};

type StatusChartProps = {
  items: ChartItem[];
};

export default function StatusChart({ items }: StatusChartProps) {
  const max = Math.max(...items.map((item) => item.value), 1);
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Status breakdown</h3>
        <p className="text-sm text-slate-500">Total pipeline: {total}</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const width = `${Math.max((item.value / max) * 100, item.value > 0 ? 6 : 0)}%`;
          return (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-slate-600">{item.label}</span>
                <span className="font-medium text-slate-900">{item.value}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width, backgroundColor: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
