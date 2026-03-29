import { create } from 'zustand'
import type { Organization, Conversation, Message, PhoneNumberWithUnread } from '@/types'

interface ChatState {
  // Data
  organizations: Organization[]
  conversations: Conversation[]
  messages: Message[]

  // Selection
  selectedPhoneNumberId: string | null
  selectedConversationId: string | null

  // Actions
  setOrganizations: (orgs: Organization[]) => void
  setConversations: (convs: Conversation[]) => void
  setMessages: (msgs: Message[]) => void
  selectPhoneNumber: (id: string | null) => void
  selectConversation: (id: string | null) => void
  addMessage: (msg: Message) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  updateConversation: (id: string, updates: Partial<Conversation>) => void
  updateMessageByWamid: (wamid: string, updates: Partial<Message>) => void
}

export const useChatStore = create<ChatState>((set) => ({
  organizations: [],
  conversations: [],
  messages: [],
  selectedPhoneNumberId: null,
  selectedConversationId: null,

  setOrganizations: (organizations) => set({ organizations }),
  setConversations: (conversations) => set({ conversations }),
  setMessages: (messages) => set({ messages }),

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

  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
}))
