export interface Organization {
  id: string
  name: string
  slug: string
  color: string
  createdAt: string
  updatedAt: string
  phoneNumbers?: PhoneNumberWithUnread[]
}

export interface PhoneNumber {
  id: string
  organizationId: string
  label: string
  phoneNumber: string
  phoneNumberId: string
  wabaId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  webhookVerifyToken?: string
}

export interface PhoneNumberWithUnread extends PhoneNumber {
  totalUnread: number
}

export interface Conversation {
  id: string
  phoneNumberId: string
  contactPhone: string
  contactName: string | null
  contactAvatarUrl: string | null
  lastMessageAt: string
  lastMessagePreview: string | null
  unreadCount: number
  status: 'active' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  conversationId: string
  wamid: string | null
  direction: 'inbound' | 'outbound'
  type: MessageType
  content: MessageContent
  status: MessageStatus
  timestamp: string
  createdAt: string
}

export type MessageType = 'text' | 'image' | 'document' | 'audio' | 'video' | 'template' | 'reaction' | 'sticker' | 'location'
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed'

export interface MessageContent {
  text?: string
  caption?: string
  url?: string
  mimeType?: string
  filename?: string
  latitude?: number
  longitude?: number
  templateName?: string
  templateParams?: string[]
}

export interface MessageTemplate {
  id: string
  phoneNumberId: string
  templateName: string
  language: string
  category: 'marketing' | 'utility' | 'authentication' | null
  status: 'approved' | 'pending' | 'rejected'
  components: unknown
  syncedAt: string
}
