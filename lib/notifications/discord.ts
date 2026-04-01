import type { DiscordChannelConfig } from '@/types'

interface DiscordNotificationPayload {
  orgName: string
  phoneLabel: string
  contactName: string | null
  contactPhone: string
  messageText: string
  timestamp: Date
}

export async function sendDiscordNotification(
  config: DiscordChannelConfig,
  payload: DiscordNotificationPayload
) {
  const displayName = payload.contactName || payload.contactPhone
  const time = payload.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const embed = {
    title: `Nova mensagem de ${displayName}`,
    description: payload.messageText || '[mídia]',
    color: 0x0d9488, // teal
    fields: [
      { name: 'Organização', value: payload.orgName, inline: true },
      { name: 'Número', value: payload.phoneLabel, inline: true },
      { name: 'Contato', value: payload.contactPhone, inline: true },
    ],
    timestamp: payload.timestamp.toISOString(),
    footer: { text: `Atrides Comms • ${time}` },
  }

  const res = await fetch(config.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] }),
  })

  if (!res.ok) {
    throw new Error(`Discord webhook failed: ${res.status}`)
  }
}
