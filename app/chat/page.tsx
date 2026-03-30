'use client'

import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { ConversationList } from '@/components/chat/ConversationList'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { useChatStore } from '@/stores/chatStore'
import { useUIStore } from '@/stores/uiStore'
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages'
import { useRealtimeConversations } from '@/hooks/useRealtimeConversations'
import { NewProjectModal } from '@/components/modals/NewProjectModal'
import { AddPhoneModal } from '@/components/modals/AddPhoneModal'
import { SendTemplateModal } from '@/components/modals/SendTemplateModal'

export default function ChatPage() {
  const setOrganizations = useChatStore((s) => s.setOrganizations)
  const setConversations = useChatStore((s) => s.setConversations)
  const setMessages = useChatStore((s) => s.setMessages)
  const setLoadingOrganizations = useChatStore((s) => s.setLoadingOrganizations)
  const setLoadingConversations = useChatStore((s) => s.setLoadingConversations)
  const setLoadingMessages = useChatStore((s) => s.setLoadingMessages)
  const selectedPhoneNumberId = useChatStore((s) => s.selectedPhoneNumberId)
  const selectedConversationId = useChatStore((s) => s.selectedConversationId)
  const mobileView = useUIStore((s) => s.mobileView)

  // Close sidebar on mobile on mount
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [setSidebarOpen])

  // Load organizations on mount
  useEffect(() => {
    setLoadingOrganizations(true)
    fetch('/api/organizations')
      .then((r) => r.json())
      .then((data) => setOrganizations(data))
      .catch(console.error)
      .finally(() => setLoadingOrganizations(false))
  }, [setOrganizations, setLoadingOrganizations])

  // Load conversations when phone number changes
  useEffect(() => {
    if (!selectedPhoneNumberId) return
    setLoadingConversations(true)
    fetch(`/api/conversations?phoneNumberId=${selectedPhoneNumberId}`)
      .then((r) => r.json())
      .then((data) => setConversations(data))
      .catch(console.error)
      .finally(() => setLoadingConversations(false))
  }, [selectedPhoneNumberId, setConversations, setLoadingConversations])

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversationId) return
    setLoadingMessages(true)
    fetch(`/api/conversations/${selectedConversationId}`)
      .then((r) => r.json())
      .then((data) => setMessages(data.messages || []))
      .catch(console.error)
      .finally(() => setLoadingMessages(false))
  }, [selectedConversationId, setMessages, setLoadingMessages])

  // Realtime subscriptions
  useRealtimeMessages()
  useRealtimeConversations()

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <div className={mobileView === 'conversations' ? 'max-md:flex max-md:flex-1 md:contents' : 'max-md:hidden md:contents'}>
          <ConversationList />
        </div>
        <div className={mobileView === 'chat' ? 'max-md:flex max-md:flex-1 md:contents' : 'max-md:hidden md:contents'}>
          <ChatPanel />
        </div>
      </div>
      <NewProjectModal />
      <AddPhoneModal />
      <SendTemplateModal />
    </div>
  )
}
