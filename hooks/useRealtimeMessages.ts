'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useChatStore } from '@/stores/chatStore'
import type { Message } from '@/types'

export function useRealtimeMessages() {
  const selectedConversationId = useChatStore((s) => s.selectedConversationId)
  const addMessage = useChatStore((s) => s.addMessage)
  const updateMessageByWamid = useChatStore((s) => s.updateMessageByWamid)
  const messages = useChatStore((s) => s.messages)

  useEffect(() => {
    if (!selectedConversationId) return

    const channel = supabase
      .channel(`messages:${selectedConversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Record<string, unknown>
          const msg: Message = {
            id: newMsg.id as string,
            conversationId: newMsg.conversation_id as string,
            wamid: newMsg.wamid as string | null,
            direction: newMsg.direction as 'inbound' | 'outbound',
            type: newMsg.type as Message['type'],
            content: newMsg.content as Message['content'],
            status: newMsg.status as Message['status'],
            timestamp: newMsg.timestamp as string,
            createdAt: newMsg.created_at as string,
          }
          // Avoid duplicates
          const exists = messages.some((m) => m.id === msg.id)
          if (!exists) {
            addMessage(msg)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversationId}`,
        },
        (payload) => {
          const updated = payload.new as Record<string, unknown>
          if (updated.wamid) {
            updateMessageByWamid(updated.wamid as string, {
              status: updated.status as Message['status'],
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversationId, addMessage, updateMessageByWamid, messages])
}
