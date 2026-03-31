import { create } from 'zustand'

type MobileView = 'conversations' | 'chat'

interface UIState {
  sidebarOpen: boolean
  orgPanelOpen: boolean
  mobileView: 'conversations' | 'chat'
  newProjectModalOpen: boolean
  addPhoneModalOpen: boolean
  sendTemplateModalOpen: boolean
  conversationFilter: 'all' | 'unread' | 'archived'
  mobileView: MobileView

  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleOrgPanel: () => void
  setMobileView: (view: 'conversations' | 'chat') => void
  setNewProjectModalOpen: (open: boolean) => void
  setAddPhoneModalOpen: (open: boolean) => void
  setSendTemplateModalOpen: (open: boolean) => void
  setConversationFilter: (filter: 'all' | 'unread' | 'archived') => void
  setMobileView: (view: MobileView) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  orgPanelOpen: true,
  mobileView: 'conversations',
  newProjectModalOpen: false,
  addPhoneModalOpen: false,
  sendTemplateModalOpen: false,
  conversationFilter: 'all',
  mobileView: 'conversations',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleOrgPanel: () => set((state) => ({ orgPanelOpen: !state.orgPanelOpen })),
  setMobileView: (view) => set({ mobileView: view }),
  setNewProjectModalOpen: (open) => set({ newProjectModalOpen: open }),
  setAddPhoneModalOpen: (open) => set({ addPhoneModalOpen: open }),
  setSendTemplateModalOpen: (open) => set({ sendTemplateModalOpen: open }),
  setConversationFilter: (filter) => set({ conversationFilter: filter }),
  setMobileView: (mobileView) => set({ mobileView }),
}))
