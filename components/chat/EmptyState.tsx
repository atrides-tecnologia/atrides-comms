import { Building2, Phone, MessageSquare, MessageCircle } from 'lucide-react'

type EmptyStateVariant = 'no-org' | 'no-phone' | 'no-conversations' | 'no-conversation-selected'

interface EmptyStateProps {
  variant: EmptyStateVariant
}

const STATES: Record<EmptyStateVariant, { icon: React.ElementType; title: string; description: string }> = {
  'no-org': {
    icon: Building2,
    title: 'Nenhuma organização',
    description: 'Crie um projeto na barra lateral para começar',
  },
  'no-phone': {
    icon: Phone,
    title: 'Selecione um número',
    description: 'Escolha um número de telefone na barra lateral para ver as conversas',
  },
  'no-conversations': {
    icon: MessageSquare,
    title: 'Nenhuma conversa',
    description: 'As conversas aparecerão aqui quando mensagens forem recebidas',
  },
  'no-conversation-selected': {
    icon: MessageCircle,
    title: 'Selecione uma conversa',
    description: 'Escolha uma conversa na lista para começar',
  },
}

export function EmptyState({ variant }: EmptyStateProps) {
  const state = STATES[variant]
  const Icon = state.icon

  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
      <Icon className="h-16 w-16 mb-4 opacity-30" />
      <p className="text-lg font-medium font-[family-name:var(--font-heading)]">
        {state.title}
      </p>
      <p className="text-sm mt-1 text-center max-w-xs">
        {state.description}
      </p>
    </div>
  )
}
