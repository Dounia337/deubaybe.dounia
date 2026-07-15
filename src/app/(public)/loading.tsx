export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl animate-pulse text-center">
        <div className="mx-auto h-8 w-32 rounded-full bg-bg-sunken" />
        <div className="mx-auto mt-5 h-12 w-3/4 rounded-lg bg-bg-sunken sm:h-14" />
        <div className="mx-auto mt-5 h-4 w-2/3 rounded bg-bg-sunken" />
      </div>
      <div className="mt-16 grid animate-pulse gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] rounded-2xl bg-bg-sunken" />
        ))}
      </div>
    </div>
  );
}
