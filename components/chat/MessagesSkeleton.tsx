import { Skeleton } from '@/components/ui/skeleton'

export function MessagesSkeleton() {
  return (
    <div className="px-4 py-2 space-y-3">
      <div className="flex items-center justify-center py-3">
        <Skeleton className="h-5 w-16 rounded-lg" />
      </div>

      <div className="flex justify-start">
        <Skeleton className="h-12 w-52 rounded-2xl rounded-bl-sm" />
      </div>

      <div className="flex justify-start mt-1">
        <Skeleton className="h-8 w-36 rounded-2xl rounded-bl-sm" />
      </div>

      <div className="flex justify-end mt-3">
        <Skeleton className="h-10 w-44 rounded-2xl rounded-br-sm" />
      </div>

      <div className="flex justify-start mt-3">
        <Skeleton className="h-16 w-60 rounded-2xl rounded-bl-sm" />
      </div>

      <div className="flex justify-end mt-3">
        <Skeleton className="h-8 w-32 rounded-2xl rounded-br-sm" />
      </div>

      <div className="flex justify-end mt-1">
        <Skeleton className="h-12 w-48 rounded-2xl rounded-br-sm" />
      </div>
    </div>
  )
}
