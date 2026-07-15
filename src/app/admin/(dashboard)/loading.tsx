export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-bg-sunken" />
      <div className="mt-2 h-4 w-64 rounded bg-bg-sunken" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-bg-sunken" />
        ))}
      </div>
    </div>
  );
}
