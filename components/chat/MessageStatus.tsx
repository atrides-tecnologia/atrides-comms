import { Check, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MessageStatus as Status } from '@/types'

interface MessageStatusProps {
  status: Status
  className?: string
}

export function MessageStatus({ status, className }: MessageStatusProps) {
  if (status === 'failed') {
    return <span className={cn('text-destructive text-[11px]', className)}>!</span>
  }

  if (status === 'sent') {
    return <Check className={cn('h-3.5 w-3.5 text-current opacity-70', className)} />
  }

  if (status === 'delivered') {
    return <CheckCheck className={cn('h-3.5 w-3.5 text-current opacity-70', className)} />
  }

  if (status === 'read') {
    return <CheckCheck className={cn('h-3.5 w-3.5 text-blue-400', className)} />
  }

  return null
}
