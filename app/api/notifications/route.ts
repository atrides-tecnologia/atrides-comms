import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const orgId = request.nextUrl.searchParams.get('organizationId')
    if (!orgId) {
      return NextResponse.json({ error: 'organizationId is required' }, { status: 400 })
    }

    const channels = await prisma.notificationChannel.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(channels)
  } catch (error) {
    console.error('Get notification channels error:', error)
    return NextResponse.json({ error: 'Failed to fetch notification channels' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.organizationId || !data.type || !data.label || !data.config) {
      return NextResponse.json({ error: 'organizationId, type, label, and config are required' }, { status: 400 })
    }

    if (!['discord', 'email'].includes(data.type)) {
      return NextResponse.json({ error: 'type must be "discord" or "email"' }, { status: 400 })
    }

    if (data.type === 'discord' && !data.config.webhookUrl) {
      return NextResponse.json({ error: 'config.webhookUrl is required for discord channels' }, { status: 400 })
    }

    const channel = await prisma.notificationChannel.create({
      data: {
        organizationId: data.organizationId,
        type: data.type,
        label: data.label,
        config: data.config,
      },
    })

    return NextResponse.json(channel, { status: 201 })
  } catch (error) {
    console.error('Create notification channel error:', error)
    return NextResponse.json({ error: 'Failed to create notification channel' }, { status: 500 })
  }
}
