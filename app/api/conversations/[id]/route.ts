import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Reset unread count when opening conversation
    if (conversation.unreadCount > 0) {
      await prisma.conversation.update({
        where: { id },
        data: { unreadCount: 0 },
      })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Get conversation error:', error)
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 })
  }
}
