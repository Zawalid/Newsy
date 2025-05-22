import { Skeleton } from "@/components/ui/skeleton"

export function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <Skeleton className="h-10 w-40" />
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
      </div>
    </div>
  )
}
