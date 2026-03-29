'use client'

import { useState } from 'react'
import { Search, MessageSquare } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ConversationItem } from './ConversationItem'
import { useChatStore } from '@/stores/chatStore'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'all' as const, label: 'Todas' },
  { key: 'unread' as const, label: 'Não lidas' },
  { key: 'archived' as const, label: 'Arquivadas' },
]

export function ConversationList() {
  const [search, setSearch] = useState('')
  const conversations = useChatStore((s) => s.conversations)
  const selectedConversationId = useChatStore((s) => s.selectedConversationId)
  const selectConversation = useChatStore((s) => s.selectConversation)
  const filter = useUIStore((s) => s.conversationFilter)
  const setFilter = useUIStore((s) => s.setConversationFilter)

  const filtered = conversations.filter((c) => {
    if (filter === 'unread' && c.unreadCount === 0) return false
    if (filter === 'archived' && c.status !== 'archived') return false
    if (filter === 'all' && c.status === 'archived') return false

    if (search) {
      const q = search.toLowerCase()
      return (
        (c.contactName?.toLowerCase().includes(q)) ||
        c.contactPhone.includes(q) ||
        c.lastMessagePreview?.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="flex h-full w-[320px] flex-col border-r border-border bg-panel">
      <div className="p-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>

        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                filter === tab.key
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-hover'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 pb-2 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            filtered.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={selectedConversationId === conv.id}
                onClick={() => selectConversation(conv.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
