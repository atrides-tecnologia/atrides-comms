'use client'

import { useEffect, useRef, useMemo, useCallback } from 'react'
import { Archive, Phone as PhoneIcon } from 'lucide-react'
import { isSameDay } from 'date-fns'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { DateSeparator } from './DateSeparator'
import { EmptyChat } from './EmptyChat'
import { useChatStore } from '@/stores/chatStore'
import { formatPhoneNumber } from '@/lib/utils'

export function ChatPanel() {
  const selectedConversationId = useChatStore((s) => s.selectedConversationId)
  const conversations = useChatStore((s) => s.conversations)
  const messages = useChatStore((s) => s.messages)
  const addMessage = useChatStore((s) => s.addMessage)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversation = conversations.find((c) => c.id === selectedConversationId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = useCallback(async (text: string) => {
    if (!selectedConversationId) return

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedConversationId, text }),
      })

      if (!res.ok) {
        const err = await res.json()
        console.error('Failed to send:', err)
      }
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }, [selectedConversationId])

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
      <div className="flex-1">
        <EmptyChat />
      </div>
    )
  }

  const displayName = conversation.contactName || formatPhoneNumber(conversation.contactPhone)

  return (
    <div className="flex flex-1 flex-col">
      {/* Chat Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <div>
          <h2 className="text-sm font-semibold font-[family-name:var(--font-heading)]">{displayName}</h2>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <PhoneIcon className="h-3 w-3" />
            {formatPhoneNumber(conversation.contactPhone)}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <Archive className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-2">
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
                  />
                )
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <MessageInput onSend={handleSend} />
    </div>
  )
}
