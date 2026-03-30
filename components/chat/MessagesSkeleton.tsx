import { Skeleton } from '@/components/ui/skeleton'

export function MessagesSkeleton() {
  return (
    <div className="px-4 py-2 space-y-3">
      {/* Date separator skeleton */}
      <div className="flex items-center justify-center py-3">
        <Skeleton className="h-5 w-16 rounded-lg" />
      </div>

      {/* Inbound message */}
      <div className="flex justify-start">
        <Skeleton className="h-12 w-52 rounded-[16px_16px_16px_4px]" />
      </div>

      {/* Inbound message */}
      <div className="flex justify-start mt-1">
        <Skeleton className="h-8 w-36 rounded-[16px_16px_16px_4px]" />
      </div>

      {/* Outbound message */}
      <div className="flex justify-end mt-3">
        <Skeleton className="h-10 w-44 rounded-[16px_16px_4px_16px]" />
      </div>

      {/* Inbound message */}
      <div className="flex justify-start mt-3">
        <Skeleton className="h-16 w-60 rounded-[16px_16px_16px_4px]" />
      </div>

      {/* Outbound message */}
      <div className="flex justify-end mt-3">
        <Skeleton className="h-8 w-32 rounded-[16px_16px_4px_16px]" />
      </div>

      {/* Outbound message */}
      <div className="flex justify-end mt-1">
        <Skeleton className="h-12 w-48 rounded-[16px_16px_4px_16px]" />
      </div>
    </div>
  )
}
