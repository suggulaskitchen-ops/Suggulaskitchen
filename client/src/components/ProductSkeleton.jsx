export default function ProductSkeleton() {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
      {/* Image Skeleton */}
      <div className="mb-4 overflow-hidden rounded-2xl bg-slate-200 h-48 w-full animate-pulse"></div>
      
      <div className="flex items-start justify-between gap-4">
        {/* Title and Description Skeleton */}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-6 w-3/4 rounded bg-slate-200 animate-pulse"></div>
          <div className="space-y-2 mt-2">
            <div className="h-4 w-full rounded bg-slate-200 animate-pulse"></div>
            <div className="h-4 w-5/6 rounded bg-slate-200 animate-pulse"></div>
          </div>
        </div>
        
        {/* Price Badge Skeleton */}
        <div className="text-right">
          <div className="h-9 w-16 rounded-full bg-slate-200 animate-pulse"></div>
        </div>
      </div>
      
      {/* Tags Skeleton */}
      <div className="mt-4 flex min-h-7 flex-nowrap items-center gap-2 overflow-hidden">
        <div className="h-6 w-16 shrink-0 rounded-full bg-slate-200 animate-pulse"></div>
        <div className="h-6 w-16 shrink-0 rounded-full bg-slate-200 animate-pulse"></div>
        <div className="h-6 w-16 shrink-0 rounded-full bg-slate-200 animate-pulse"></div>
      </div>
      
      {/* Button Skeleton */}
      <div className="mt-auto pt-6">
        <div className="h-11 w-full rounded-xl bg-slate-200 animate-pulse"></div>
      </div>
    </article>
  )
}
