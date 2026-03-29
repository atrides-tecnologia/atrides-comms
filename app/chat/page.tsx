'use client'

import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { ConversationList } from '@/components/chat/ConversationList'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { useChatStore } from '@/stores/chatStore'
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages'
import { useRealtimeConversations } from '@/hooks/useRealtimeConversations'
import { NewProjectModal } from '@/components/modals/NewProjectModal'
import { AddPhoneModal } from '@/components/modals/AddPhoneModal'
import { SendTemplateModal } from '@/components/modals/SendTemplateModal'

export default function ChatPage() {
  const setOrganizations = useChatStore((s) => s.setOrganizations)
  const setConversations = useChatStore((s) => s.setConversations)
  const setMessages = useChatStore((s) => s.setMessages)
  const selectedPhoneNumberId = useChatStore((s) => s.selectedPhoneNumberId)
  const selectedConversationId = useChatStore((s) => s.selectedConversationId)

  // Load organizations on mount
  useEffect(() => {
    fetch('/api/organizations')
      .then((r) => r.json())
      .then((data) => setOrganizations(data))
      .catch(console.error)
  }, [setOrganizations])

  // Load conversations when phone number changes
  useEffect(() => {
    if (!selectedPhoneNumberId) return
    fetch(`/api/conversations?phoneNumberId=${selectedPhoneNumberId}`)
      .then((r) => r.json())
      .then((data) => setConversations(data))
      .catch(console.error)
  }, [selectedPhoneNumberId, setConversations])

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversationId) return
    fetch(`/api/conversations/${selectedConversationId}`)
      .then((r) => r.json())
      .then((data) => setMessages(data.messages || []))
      .catch(console.error)
  }, [selectedConversationId, setMessages])

  // Realtime subscriptions
  useRealtimeMessages()
  useRealtimeConversations()

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <ConversationList />
        <ChatPanel />
      </div>
      <NewProjectModal />
      <AddPhoneModal />
      <SendTemplateModal />
    </div>
  )
}
