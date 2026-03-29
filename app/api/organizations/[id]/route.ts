import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, color } = await request.json()

    const org = await prisma.organization.update({
      where: { id },
      data: {
        ...(name && { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }),
        ...(color && { color }),
      },
    })

    return NextResponse.json(org)
  } catch (error) {
    console.error('Update organization error:', error)
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.organization.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete organization error:', error)
    return NextResponse.json({ error: 'Failed to delete organization' }, { status: 500 })
  }
}
