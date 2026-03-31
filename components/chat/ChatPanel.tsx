'use client'

import { useEffect, useRef, useMemo, useCallback, useState } from 'react'
import { Archive, Phone as PhoneIcon, Loader2, ArrowLeft } from 'lucide-react'
import { isSameDay } from 'date-fns'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { DateSeparator } from './DateSeparator'
import { EmptyState } from './EmptyState'
import { MessagesSkeleton } from './MessagesSkeleton'
import { useChatStore } from '@/stores/chatStore'
import { useUIStore } from '@/stores/uiStore'
import { formatPhoneNumber, getInitials, stringToColor } from '@/lib/utils'

export function ChatPanel() {
  const selectedConversationId = useChatStore((s) => s.selectedConversationId)
  const conversations = useChatStore((s) => s.conversations)
  const messages = useChatStore((s) => s.messages)
  const loadingMessages = useChatStore((s) => s.loadingMessages)
  const removeConversation = useChatStore((s) => s.removeConversation)
  const setMobileView = useUIStore((s) => s.setMobileView)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  const [archiving, setArchiving] = useState(false)

  const conversation = conversations.find((c) => c.id === selectedConversationId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  useEffect(() => {
    if (!sendError) return
    const timer = setTimeout(() => setSendError(null), 5000)
    return () => clearTimeout(timer)
  }, [sendError])

  const handleSend = useCallback(async (text: string) => {
    if (!selectedConversationId) return
    setSendError(null)

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedConversationId, text }),
      })

      if (!res.ok) {
        const err = await res.json()
        setSendError(err.error || 'Falha ao enviar mensagem')
      }
    } catch {
      setSendError('Erro de conexão. Verifique sua internet.')
    }
  }, [selectedConversationId])

  const handleArchive = useCallback(async () => {
    if (!selectedConversationId || archiving) return
    setArchiving(true)

    try {
      const res = await fetch(`/api/conversations/${selectedConversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      })

      if (res.ok) {
        removeConversation(selectedConversationId)
      }
    } catch {
      // Silently fail
    } finally {
      setArchiving(false)
    }
  }, [selectedConversationId, archiving, removeConversation])

  const groupedMessages = useMemo(() => {
    const groups: { date: Date; messages: typeof messages }[] = []

    messages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp)
      const lastGroup = groups[groups.length - 1]

      if (lastGroup && isSameDay(lastGroup.date, msgDate)) {
        lastGroup.messages.push(msg)
      } else {
        groups.push({ date: msgDate, messages: [msg] })
      }
    })

    return groups
  }, [messages])

  if (!selectedConversationId || !conversation) {
    return (
      <div className="flex-1 bg-chat-bg">
        <EmptyState variant="no-conversation-selected" />
      </div>
    )
  }

  const displayName = conversation.contactName || formatPhoneNumber(conversation.contactPhone)
  const avatarColor = stringToColor(conversation.contactPhone)
  const initials = conversation.contactName ? getInitials(conversation.contactName) : '#'

  return (
    <div className="flex flex-1 flex-col bg-chat-bg">
      <div className="flex h-14 items-center justify-between border-b border-border px-4 bg-background">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => setMobileView('conversations')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarFallback style={{ backgroundColor: avatarColor, color: 'white' }} className="text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-sm font-semibold font-[family-name:var(--font-heading)]">{displayName}</h2>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <PhoneIcon className="h-3 w-3" />
              {formatPhoneNumber(conversation.contactPhone)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={handleArchive}
          disabled={archiving}
          title="Arquivar conversa"
        >
          {archiving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Archive className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 py-2">
          {loadingMessages ? (
            <MessagesSkeleton />
          ) : (
            <>
              {groupedMessages.map((group, gi) => (
                <div key={gi}>
                  <DateSeparator date={group.date} />
                  {group.messages.map((msg, mi) => {
                    const prev = mi > 0 ? group.messages[mi - 1] : null
                    const isSameSender = prev?.direction === msg.direction
                    return (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        isSameSenderAsPrevious={isSameSender}
                        contactName={conversation.contactName || undefined}
                        contactPhone={conversation.contactPhone}
                      />
                    )
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {sendError && (
        <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
          <p className="text-xs text-destructive">{sendError}</p>
        </div>
      )}

      <MessageInput onSend={handleSend} />
    </div>
  )
}
