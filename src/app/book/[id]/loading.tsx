import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-36" />
        <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-[240px_1fr] sm:gap-14">
          <div className="w-full max-w-[240px] space-y-4">
            <Skeleton className="aspect-[2/3] w-full rounded-sm" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-4 pt-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-48" />
            <div className="mt-8 max-w-prose space-y-3 border-l-2 border-hairline pl-6">
              {["w-full", "w-11/12", "w-full", "w-10/12", "w-2/3"].map((width) => (
                <Skeleton key={width} className={`h-4 ${width}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
