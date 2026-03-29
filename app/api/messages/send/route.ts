import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTextMessage } from '@/lib/whatsapp/api'

export async function POST(request: NextRequest) {
  try {
    const { conversationId, text } = await request.json()

    if (!conversationId || !text) {
      return NextResponse.json({ error: 'conversationId and text are required' }, { status: 400 })
    }

    // Get conversation with phone number details
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { phoneNumber: true },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Send via Meta API
    const result = await sendTextMessage({
      phoneNumberId: conversation.phoneNumber.phoneNumberId,
      accessToken: conversation.phoneNumber.accessToken,
      to: conversation.contactPhone,
      text,
    })

    const wamid = result.messages?.[0]?.id || null

    // Save message to database
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        wamid,
        direction: 'outbound',
        type: 'text',
        content: { text },
        status: 'sent',
        timestamp: new Date().toISOString(),
      },
    })

    // Update conversation
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date(),
        lastMessagePreview: text.length > 50 ? text.slice(0, 50) + '...' : text,
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    )
  }
}
