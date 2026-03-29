import type { WebhookMessage, WebhookChangeValue } from './types'
import type { MessageContent } from '@/types'

export function parseMessageContent(msg: WebhookMessage): { type: string; content: MessageContent } {
  switch (msg.type) {
    case 'text':
      return { type: 'text', content: { text: msg.text?.body } }
    case 'image':
      return { type: 'image', content: { url: msg.image?.id, caption: msg.image?.caption, mimeType: msg.image?.mime_type } }
    case 'document':
      return { type: 'document', content: { url: msg.document?.id, filename: msg.document?.filename, mimeType: msg.document?.mime_type, caption: msg.document?.caption } }
    case 'audio':
      return { type: 'audio', content: { url: msg.audio?.id, mimeType: msg.audio?.mime_type } }
    case 'video':
      return { type: 'video', content: { url: msg.video?.id, caption: msg.video?.caption, mimeType: msg.video?.mime_type } }
    case 'sticker':
      return { type: 'sticker', content: { url: msg.sticker?.id, mimeType: msg.sticker?.mime_type } }
    case 'location':
      return { type: 'location', content: { latitude: msg.location?.latitude, longitude: msg.location?.longitude } }
    case 'reaction':
      return { type: 'reaction', content: { text: msg.reaction?.emoji } }
    default:
      return { type: msg.type, content: { text: `[${msg.type}]` } }
  }
}

export function extractMessagesFromPayload(value: WebhookChangeValue) {
  const phoneNumberId = value.metadata.phone_number_id
  const messages = value.messages || []
  const contacts = value.contacts || []

  return messages.map((msg) => {
    const contact = contacts.find((c) => c.wa_id === msg.from)
    const { type, content } = parseMessageContent(msg)

    return {
      phoneNumberId,
      from: msg.from,
      wamid: msg.id,
      contactName: contact?.profile.name || null,
      type,
      content,
      timestamp: new Date(parseInt(msg.timestamp) * 1000).toISOString(),
    }
  })
}

export function extractStatusesFromPayload(value: WebhookChangeValue) {
  const statuses = value.statuses || []

  return statuses.map((s) => ({
    wamid: s.id,
    status: s.status,
    timestamp: new Date(parseInt(s.timestamp) * 1000).toISOString(),
  }))
}
