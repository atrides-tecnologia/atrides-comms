'use client'

import { useEffect } from 'react'
import { Menu, LogOut } from 'lucide-react'
import { IconSidebar } from '@/components/layout/IconSidebar'
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
import { TooltipProvider } from '@/components/ui/tooltip'

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
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  useEffect(() => {
    setLoadingOrganizations(true)
    fetch('/api/organizations')
      .then((r) => r.json())
      .then((data) => setOrganizations(data))
      .catch(console.error)
      .finally(() => setLoadingOrganizations(false))
  }, [setOrganizations, setLoadingOrganizations])

  useEffect(() => {
    if (!selectedPhoneNumberId) return
    setLoadingConversations(true)
    fetch(`/api/conversations?phoneNumberId=${selectedPhoneNumberId}`)
      .then((r) => r.json())
      .then((data) => setConversations(data))
      .catch(console.error)
      .finally(() => setLoadingConversations(false))
  }, [selectedPhoneNumberId, setConversations, setLoadingConversations])

  useEffect(() => {
    if (!selectedConversationId) return
    setLoadingMessages(true)
    fetch(`/api/conversations/${selectedConversationId}`)
      .then((r) => r.json())
      .then((data) => setMessages(data.messages || []))
      .catch(console.error)
      .finally(() => setLoadingMessages(false))
  }, [selectedConversationId, setMessages, setLoadingMessages])

  useRealtimeMessages()
  useRealtimeConversations()

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-canvas flex items-center justify-center md:p-4">
        <div className="flex w-full md:max-w-[1600px] h-screen md:h-[calc(100vh-2rem)] md:max-h-[920px] md:rounded-2xl md:shadow-card overflow-hidden bg-background">
          <IconSidebar />

          {/* Mobile header */}
          <div className="md:hidden absolute top-0 left-0 right-0 z-30 flex h-14 items-center justify-between px-4 bg-background border-b border-border">
            <div className="flex items-center gap-3">
              <button onClick={toggleSidebar} className="p-1">
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-bold font-[family-name:var(--font-heading)]">Atrides Comms</h1>
            </div>
            <button className="p-1 text-muted-foreground">
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          <Sidebar />

          <div className={mobileView === 'conversations' ? 'max-md:flex max-md:flex-1 max-md:mt-14 md:contents' : 'max-md:hidden md:contents'}>
            <ConversationList />
          </div>

          <div className={mobileView === 'chat' ? 'max-md:flex max-md:flex-1 max-md:mt-14 md:contents' : 'max-md:hidden md:contents'}>
            <ChatPanel />
          </div>
        </div>
      </div>

      <NewProjectModal />
      <AddPhoneModal />
      <SendTemplateModal />
    </TooltipProvider>
  )
}
