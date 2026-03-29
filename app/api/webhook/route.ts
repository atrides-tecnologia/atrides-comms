import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { extractMessagesFromPayload, extractStatusesFromPayload } from '@/lib/whatsapp/webhook'
import type { WebhookPayload } from '@/lib/whatsapp/types'

// GET — Webhook verification from Meta
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode !== 'subscribe' || !token || !challenge) {
    return new NextResponse('Bad Request', { status: 400 })
  }

  // Find a phone number with this verify token
  const phoneNumber = await prisma.phoneNumber.findFirst({
    where: { webhookVerifyToken: token, isActive: true },
  })

  if (!phoneNumber) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return new NextResponse(challenge, { status: 200 })
}

// POST — Receive webhook notifications from Meta
export async function POST(request: NextRequest) {
  const body = (await request.json()) as WebhookPayload

  if (body.object !== 'whatsapp_business_account') {
    return NextResponse.json({ error: 'Invalid object' }, { status: 400 })
  }

  // Process asynchronously but respond 200 quickly
  try {
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field !== 'messages') continue

        const value = change.value
        const metaPhoneNumberId = value.metadata.phone_number_id

        // Find our phone number record
        const phoneNumber = await prisma.phoneNumber.findFirst({
          where: { phoneNumberId: metaPhoneNumberId, isActive: true },
        })

        if (!phoneNumber) continue

        // Process incoming messages
        const parsedMessages = extractMessagesFromPayload(value)
        for (const msg of parsedMessages) {
          // Find or create conversation
          const conversation = await prisma.conversation.upsert({
            where: {
              phoneNumberId_contactPhone: {
                phoneNumberId: phoneNumber.id,
                contactPhone: msg.from,
              },
            },
            create: {
              phoneNumberId: phoneNumber.id,
              contactPhone: msg.from,
              contactName: msg.contactName,
              lastMessageAt: msg.timestamp,
              lastMessagePreview: msg.content.text || `[${msg.type}]`,
              unreadCount: 1,
            },
            update: {
              contactName: msg.contactName || undefined,
              lastMessageAt: msg.timestamp,
              lastMessagePreview: msg.content.text || `[${msg.type}]`,
              unreadCount: { increment: 1 },
            },
          })

          // Save message
          await prisma.message.create({
            data: {
              conversationId: conversation.id,
              wamid: msg.wamid,
              direction: 'inbound',
              type: msg.type,
              content: msg.content as unknown as Prisma.InputJsonValue,
              status: 'delivered',
              timestamp: msg.timestamp,
            },
          })
        }

        // Process status updates
        const statuses = extractStatusesFromPayload(value)
        for (const status of statuses) {
          await prisma.message.updateMany({
            where: { wamid: status.wamid },
            data: { status: status.status },
          })
        }
      }
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
  }

  return NextResponse.json({ status: 'ok' }, { status: 200 })
}
