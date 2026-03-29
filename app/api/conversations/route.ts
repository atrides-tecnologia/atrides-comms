import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const phoneNumberId = request.nextUrl.searchParams.get('phoneNumberId')

    if (!phoneNumberId) {
      return NextResponse.json({ error: 'phoneNumberId is required' }, { status: 400 })
    }

    const conversations = await prisma.conversation.findMany({
      where: { phoneNumberId },
      orderBy: { lastMessageAt: 'desc' },
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}
