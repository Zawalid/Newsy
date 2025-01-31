import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// function getSkeletonWidth(index: number): string {
//   if (index === 0) return `${90 + Math.random() * 10}%`;

//   const patterns = [
//     () => `${85 + Math.random() * 15}%`,
//     () => `${75 + Math.random() * 15}%`,
//     () => `${60 + Math.random() * 20}%`,
//   ];

//   const weights = [0.5, 0.3, 0.2];
//   const random = Math.random();
//   let patternIndex = 0;

//   let sum = 0;
//   for (let i = 0; i < weights.length; i++) {
//     sum += weights[i];
//     if (random < sum) {
//       patternIndex = i;
//       break;
//     }
//   }

//   return patterns[patternIndex]();
// }

export function EmailDisplaySkeleton() {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="flex items-baseline gap-10 p-4">
        <div className="flex items-start gap-5 flex-1">
          <div className="grid gap-4 w-full">
            <Skeleton className="h-7 w-2/3" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-3.5 w-8" />
                  <Skeleton className="h-3.5 w-64" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Skeleton className="h-4 w-32" />
      </div>
      <Separator />
      <div className="p-4 w-full space-y-8 flex-1 max-w-2xl mx-auto">
        <div className="space-y-4">
          <Skeleton className="h-52 w-full rounded-lg" />
          <Skeleton className="h-8 w-5/6" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>

        {[1, 2, 3, 4, 5].map((e) => (
          <div key={e} className="space-y-4 pt-6">
            <div className="flex gap-4">
              <Skeleton className="h-24 w-24 rounded" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-5/6" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
            <Separator className="mt-6" />
          </div>
        ))}

        <div className="space-y-4 pt-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-4">
            {[1, 2].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function EmailsListSkeleton() {
  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
      <div className="flex flex-col pt-4  gap-2 px-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm bg-card transition-colors hover:bg-accent/50"
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-2 w-2 rounded-full" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-2/3 mt-1.5" />
            </div>
            <div className="w-full space-y-2 mt-1">
              <Skeleton className="h-3 w-[95%]" />
              <Skeleton className="h-3 w-[85%]" />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
