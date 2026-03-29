'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useChatStore } from '@/stores/chatStore'
import type { Conversation } from '@/types'

export function useRealtimeConversations() {
  const selectedPhoneNumberId = useChatStore((s) => s.selectedPhoneNumberId)
  const conversations = useChatStore((s) => s.conversations)
  const setConversations = useChatStore((s) => s.setConversations)
  const updateConversation = useChatStore((s) => s.updateConversation)

  useEffect(() => {
    if (!selectedPhoneNumberId) return

    const channel = supabase
      .channel(`conversations:${selectedPhoneNumberId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversations',
          filter: `phone_number_id=eq.${selectedPhoneNumberId}`,
        },
        (payload) => {
          const conv = payload.new as Record<string, unknown>
          const newConv: Conversation = {
            id: conv.id as string,
            phoneNumberId: conv.phone_number_id as string,
            contactPhone: conv.contact_phone as string,
            contactName: conv.contact_name as string | null,
            contactAvatarUrl: conv.contact_avatar_url as string | null,
            lastMessageAt: conv.last_message_at as string,
            lastMessagePreview: conv.last_message_preview as string | null,
            unreadCount: conv.unread_count as number,
            status: conv.status as 'active' | 'archived',
            createdAt: conv.created_at as string,
            updatedAt: conv.updated_at as string,
          }
          setConversations([newConv, ...conversations])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `phone_number_id=eq.${selectedPhoneNumberId}`,
        },
        (payload) => {
          const conv = payload.new as Record<string, unknown>
          updateConversation(conv.id as string, {
            lastMessageAt: conv.last_message_at as string,
            lastMessagePreview: conv.last_message_preview as string | null,
            unreadCount: conv.unread_count as number,
            status: conv.status as 'active' | 'archived',
            contactName: conv.contact_name as string | null,
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedPhoneNumberId, conversations, setConversations, updateConversation])
}
