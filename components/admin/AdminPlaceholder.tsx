type PlaceholderProps = {
  title: string;
  stage: string;
};

export default function AdminPlaceholder({ title, stage }: PlaceholderProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">
        Coming in {stage}. Navigation and auth shell are already wired.
      </p>
    </div>
  );
}
