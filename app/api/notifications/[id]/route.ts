import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()

    const channel = await prisma.notificationChannel.update({
      where: { id },
      data: {
        ...(data.label && { label: data.label }),
        ...(data.config && { config: data.config }),
        ...(typeof data.isActive === 'boolean' && { isActive: data.isActive }),
      },
    })

    return NextResponse.json(channel)
  } catch (error) {
    console.error('Update notification channel error:', error)
    return NextResponse.json({ error: 'Failed to update notification channel' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.notificationChannel.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete notification channel error:', error)
    return NextResponse.json({ error: 'Failed to delete notification channel' }, { status: 500 })
  }
}
