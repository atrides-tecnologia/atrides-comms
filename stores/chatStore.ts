import { create } from 'zustand'
import type { Organization, Conversation, Message, PhoneNumberWithUnread } from '@/types'

interface ChatState {
  // Data
  organizations: Organization[]
  conversations: Conversation[]
  messages: Message[]

  // Loading states
  loadingOrganizations: boolean
  loadingConversations: boolean
  loadingMessages: boolean

  // Selection
  selectedPhoneNumberId: string | null
  selectedConversationId: string | null

  // Actions
  setOrganizations: (orgs: Organization[]) => void
  setConversations: (convs: Conversation[]) => void
  setMessages: (msgs: Message[]) => void
  setLoadingOrganizations: (loading: boolean) => void
  setLoadingConversations: (loading: boolean) => void
  setLoadingMessages: (loading: boolean) => void
  selectPhoneNumber: (id: string | null) => void
  selectConversation: (id: string | null) => void
  addMessage: (msg: Message) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  updateOrganization: (id: string, updates: Partial<Organization>) => void
  updatePhoneNumber: (orgId: string, phoneId: string, updates: Partial<PhoneNumberWithUnread>) => void
  updateConversation: (id: string, updates: Partial<Conversation>) => void
  updateMessageByWamid: (wamid: string, updates: Partial<Message>) => void
  removeConversation: (id: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  organizations: [],
  conversations: [],
  messages: [],
  loadingOrganizations: false,
  loadingConversations: false,
  loadingMessages: false,
  selectedPhoneNumberId: null,
  selectedConversationId: null,

  setOrganizations: (organizations) => set({ organizations }),
  setConversations: (conversations) => set({ conversations }),
  setMessages: (messages) => set({ messages }),
  setLoadingOrganizations: (loadingOrganizations) => set({ loadingOrganizations }),
  setLoadingConversations: (loadingConversations) => set({ loadingConversations }),
  setLoadingMessages: (loadingMessages) => set({ loadingMessages }),

  selectPhoneNumber: (id) => set({ selectedPhoneNumberId: id, selectedConversationId: null, messages: [] }),
  selectConversation: (id) => set({ selectedConversationId: id }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  updateMessageByWamid: (wamid, updates) =>
    set((state) => ({
      messages: state.messages.map((m) => (m.wamid === wamid ? { ...m, ...updates } : m)),
    })),

  updateOrganization: (id, updates) =>
    set((state) => ({
      organizations: state.organizations.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    })),

  updatePhoneNumber: (orgId, phoneId, updates) =>
    set((state) => ({
      organizations: state.organizations.map((o) =>
        o.id === orgId
          ? { ...o, phoneNumbers: o.phoneNumbers?.map((p) => (p.id === phoneId ? { ...p, ...updates } : p)) }
          : o
      ),
    })),

  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  removeConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      selectedConversationId: state.selectedConversationId === id ? null : state.selectedConversationId,
      messages: state.selectedConversationId === id ? [] : state.messages,
    })),
}))
