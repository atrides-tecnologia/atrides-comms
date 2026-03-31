import { isToday, isYesterday, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DateSeparatorProps {
  date: Date
}

function formatDateLabel(date: Date): string {
  if (isToday(date)) return 'Hoje'
  if (isYesterday(date)) return 'Ontem'
  return format(date, "d 'de' MMMM", { locale: ptBR })
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center py-3">
      <span className="rounded-full bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-xs">
        {formatDateLabel(date)}
      </span>
    </div>
  )
}
