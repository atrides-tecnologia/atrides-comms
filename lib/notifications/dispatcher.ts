import { prisma } from '@/lib/prisma'
import { sendDiscordNotification } from './discord'
import type { DiscordChannelConfig } from '@/types'

interface NotificationPayload {
  orgName: string
  phoneLabel: string
  contactName: string | null
  contactPhone: string
  messageText: string
  timestamp: Date
}

export async function dispatchNotifications(
  organizationId: string,
  payload: NotificationPayload
) {
  const channels = await prisma.notificationChannel.findMany({
    where: { organizationId, isActive: true },
  })

  const results = await Promise.allSettled(
    channels.map(async (channel) => {
      switch (channel.type) {
        case 'discord':
          return sendDiscordNotification(
            channel.config as unknown as DiscordChannelConfig,
            payload
          )
        case 'email':
          // Email dispatcher will be added in a future US
          console.log(`[notifications] Email dispatcher not yet implemented, skipping channel ${channel.id}`)
          return
        default:
          console.log(`[notifications] Unknown channel type: ${channel.type}`)
      }
    })
  )

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[notifications] Failed to send notification:', result.reason)
    }
  }
}
