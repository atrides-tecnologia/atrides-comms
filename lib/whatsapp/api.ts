import { META_GRAPH_API_URL } from '@/lib/constants'

interface SendTextMessageParams {
  phoneNumberId: string
  accessToken: string
  to: string
  text: string
}

interface SendTemplateMessageParams {
  phoneNumberId: string
  accessToken: string
  to: string
  templateName: string
  language: string
  components?: unknown[]
}

export async function sendTextMessage({ phoneNumberId, accessToken, to, text }: SendTextMessageParams) {
  const response = await fetch(`${META_GRAPH_API_URL}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: text },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to send message')
  }

  return response.json()
}

export async function sendTemplateMessage({ phoneNumberId, accessToken, to, templateName, language, components }: SendTemplateMessageParams) {
  const response = await fetch(`${META_GRAPH_API_URL}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: language },
        components,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to send template')
  }

  return response.json()
}

export async function fetchTemplates(wabaId: string, accessToken: string) {
  const response = await fetch(`${META_GRAPH_API_URL}/${wabaId}/message_templates`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to fetch templates')
  }

  return response.json()
}
