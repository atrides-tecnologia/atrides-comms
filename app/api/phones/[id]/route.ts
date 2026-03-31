import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()

    const phone = await prisma.phoneNumber.update({
      where: { id },
      data: {
        ...(data.label && { label: data.label }),
        ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        ...(data.phoneNumberId && { phoneNumberId: data.phoneNumberId }),
        ...(data.wabaId && { wabaId: data.wabaId }),
        ...(data.accessToken && { accessToken: data.accessToken }),
        ...(data.webhookVerifyToken && { webhookVerifyToken: data.webhookVerifyToken }),
        ...(typeof data.isActive === 'boolean' && { isActive: data.isActive }),
      },
    })

    const { accessToken: _, webhookVerifyToken: __, ...safePhone } = phone
    return NextResponse.json(safePhone)
  } catch (error) {
    console.error('Update phone error:', error)
    return NextResponse.json({ error: 'Failed to update phone number' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.phoneNumber.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete phone error:', error)
    return NextResponse.json({ error: 'Failed to delete phone number' }, { status: 500 })
  }
}
