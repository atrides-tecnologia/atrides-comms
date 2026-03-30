import { create } from 'zustand'

type MobileView = 'conversations' | 'chat'

interface UIState {
  sidebarOpen: boolean
  newProjectModalOpen: boolean
  addPhoneModalOpen: boolean
  sendTemplateModalOpen: boolean
  conversationFilter: 'all' | 'unread' | 'archived'
  mobileView: MobileView

  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setNewProjectModalOpen: (open: boolean) => void
  setAddPhoneModalOpen: (open: boolean) => void
  setSendTemplateModalOpen: (open: boolean) => void
  setConversationFilter: (filter: 'all' | 'unread' | 'archived') => void
  setMobileView: (view: MobileView) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  newProjectModalOpen: false,
  addPhoneModalOpen: false,
  sendTemplateModalOpen: false,
  conversationFilter: 'all',
  mobileView: 'conversations',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setNewProjectModalOpen: (open) => set({ newProjectModalOpen: open }),
  setAddPhoneModalOpen: (open) => set({ addPhoneModalOpen: open }),
  setSendTemplateModalOpen: (open) => set({ sendTemplateModalOpen: open }),
  setConversationFilter: (filter) => set({ conversationFilter: filter }),
  setMobileView: (mobileView) => set({ mobileView }),
}))
