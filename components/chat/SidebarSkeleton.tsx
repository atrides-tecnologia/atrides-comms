import { Skeleton } from '@/components/ui/skeleton'

export function SidebarSkeleton() {
  return (
    <div className="p-3 space-y-3">
      {[1, 2].map((group) => (
        <div key={group} className="space-y-1">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Skeleton className="h-3.5 w-3.5" />
            <Skeleton className="h-2.5 w-2.5 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          {[1, 2].map((phone) => (
            <div key={phone} className="ml-4 flex items-center gap-2 px-2 py-1.5">
              <Skeleton className="h-3.5 w-3.5" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
