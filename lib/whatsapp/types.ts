// Meta WhatsApp Cloud API webhook payload types

export interface WebhookPayload {
  object: string
  entry: WebhookEntry[]
}

export interface WebhookEntry {
  id: string
  changes: WebhookChange[]
}

export interface WebhookChange {
  value: WebhookChangeValue
  field: string
}

export interface WebhookChangeValue {
  messaging_product: string
  metadata: {
    display_phone_number: string
    phone_number_id: string
  }
  contacts?: WebhookContact[]
  messages?: WebhookMessage[]
  statuses?: WebhookStatus[]
}

export interface WebhookContact {
  profile: {
    name: string
  }
  wa_id: string
}

export interface WebhookMessage {
  from: string
  id: string
  timestamp: string
  type: string
  text?: { body: string }
  image?: WebhookMedia
  document?: WebhookMedia & { filename?: string }
  audio?: WebhookMedia
  video?: WebhookMedia
  sticker?: WebhookMedia
  location?: { latitude: number; longitude: number; name?: string; address?: string }
  reaction?: { message_id: string; emoji: string }
}

export interface WebhookMedia {
  id: string
  mime_type: string
  sha256?: string
  caption?: string
}

export interface WebhookStatus {
  id: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  timestamp: string
  recipient_id: string
  errors?: Array<{ code: number; title: string }>
}
