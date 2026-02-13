import { Skeleton } from "@/components/ui/skeleton";

export function ListingCardSkeleton() {
  return (
    <article className="w-[280px] shrink-0 sm:w-[320px]">
      {/* Image skeleton */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
        
        {/* Price tag skeleton */}
        <div className="absolute bottom-4 left-4 z-10">
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
        
        {/* Favorite button skeleton */}
        <div className="absolute right-4 top-4 z-10">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        
        {/* Category label skeleton */}
        <div className="absolute left-4 top-4 z-10">
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
      </div>
      
      {/* Info skeleton */}
      <div className="px-1 pt-4 space-y-2">
        <Skeleton className="h-5 w-full" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </article>
  );
}
