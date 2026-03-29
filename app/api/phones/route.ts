import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const orgId = request.nextUrl.searchParams.get('organizationId')

    const phones = await prisma.phoneNumber.findMany({
      where: orgId ? { organizationId: orgId } : undefined,
      orderBy: { label: 'asc' },
    })

    return NextResponse.json(phones)
  } catch (error) {
    console.error('Get phones error:', error)
    return NextResponse.json({ error: 'Failed to fetch phone numbers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const required = ['organizationId', 'label', 'phoneNumber', 'phoneNumberId', 'wabaId', 'accessToken']
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const phone = await prisma.phoneNumber.create({
      data: {
        organizationId: data.organizationId,
        label: data.label,
        phoneNumber: data.phoneNumber,
        phoneNumberId: data.phoneNumberId,
        wabaId: data.wabaId,
        accessToken: data.accessToken,
        webhookVerifyToken: data.webhookVerifyToken || `verify_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      },
    })

    return NextResponse.json(phone, { status: 201 })
  } catch (error) {
    console.error('Create phone error:', error)
    return NextResponse.json({ error: 'Failed to create phone number' }, { status: 500 })
  }
}
