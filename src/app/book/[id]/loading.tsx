export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FBFBF9] text-slate-900 antialiased">
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="h-10 w-40 animate-pulse rounded-full bg-slate-200/70" />
        <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-[240px_1fr] sm:gap-12">
          <div className="aspect-[2/3] w-full max-w-[240px] animate-pulse rounded-2xl bg-slate-200/70" />
          <div className="space-y-4 pt-2">
            <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200/70" />
            <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-slate-200/70" />
            <div className="h-5 w-48 animate-pulse rounded-full bg-slate-200/70" />
            <div className="mt-8 space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 animate-pulse rounded-full bg-slate-200/70"
                  style={{ width: `${95 - index * 12}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
