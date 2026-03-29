import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        phoneNumbers: {
          where: { isActive: true },
          include: {
            conversations: {
              select: { unreadCount: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    // Map to include totalUnread per phone number
    const result = organizations.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      color: org.color,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
      phoneNumbers: org.phoneNumbers.map((phone) => ({
        id: phone.id,
        organizationId: phone.organizationId,
        label: phone.label,
        phoneNumber: phone.phoneNumber,
        phoneNumberId: phone.phoneNumberId,
        wabaId: phone.wabaId,
        accessToken: phone.accessToken,
        webhookVerifyToken: phone.webhookVerifyToken,
        isActive: phone.isActive,
        createdAt: phone.createdAt,
        updatedAt: phone.updatedAt,
        totalUnread: phone.conversations.reduce((sum, c) => sum + c.unreadCount, 0),
      })),
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Get organizations error:', error)
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, color } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const org = await prisma.organization.create({
      data: { name, slug, color: color || '#0066FF' },
    })

    return NextResponse.json(org, { status: 201 })
  } catch (error) {
    console.error('Create organization error:', error)
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
  }
}
