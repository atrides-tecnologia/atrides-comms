import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTemplateMessage } from '@/lib/whatsapp/api'

export async function POST(request: NextRequest) {
  try {
    const { conversationId, templateName, language, components } = await request.json()

    if (!conversationId || !templateName) {
      return NextResponse.json({ error: 'conversationId and templateName are required' }, { status: 400 })
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { phoneNumber: true },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const result = await sendTemplateMessage({
      phoneNumberId: conversation.phoneNumber.phoneNumberId,
      accessToken: conversation.phoneNumber.accessToken,
      to: conversation.contactPhone,
      templateName,
      language: language || 'pt_BR',
      components,
    })

    const wamid = result.messages?.[0]?.id || null

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        wamid,
        direction: 'outbound',
        type: 'template',
        content: { templateName, templateParams: components },
        status: 'sent',
        timestamp: new Date().toISOString(),
      },
    })

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date(),
        lastMessagePreview: `[Template: ${templateName}]`,
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Send template error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send template' },
      { status: 500 }
    )
  }
}
