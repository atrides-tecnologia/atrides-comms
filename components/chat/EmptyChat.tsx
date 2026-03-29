import { MessageCircle } from 'lucide-react'

export function EmptyChat() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
      <MessageCircle className="h-16 w-16 mb-4 opacity-30" />
      <p className="text-lg font-medium font-[family-name:var(--font-heading)]">
        Selecione uma conversa
      </p>
      <p className="text-sm mt-1">
        Escolha uma conversa na lista para começar
      </p>
    </div>
  )
}
