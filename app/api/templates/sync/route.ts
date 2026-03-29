import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchTemplates } from '@/lib/whatsapp/api'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumberId } = await request.json()

    if (!phoneNumberId) {
      return NextResponse.json({ error: 'phoneNumberId is required' }, { status: 400 })
    }

    const phone = await prisma.phoneNumber.findUnique({
      where: { id: phoneNumberId },
    })

    if (!phone) {
      return NextResponse.json({ error: 'Phone number not found' }, { status: 404 })
    }

    const result = await fetchTemplates(phone.wabaId, phone.accessToken)
    const templates = result.data || []

    let synced = 0
    for (const tpl of templates) {
      await prisma.messageTemplate.upsert({
        where: {
          phoneNumberId_templateName_language: {
            phoneNumberId: phone.id,
            templateName: tpl.name,
            language: tpl.language,
          },
        },
        create: {
          phoneNumberId: phone.id,
          templateName: tpl.name,
          language: tpl.language,
          category: tpl.category?.toLowerCase() || null,
          status: tpl.status?.toLowerCase() === 'approved' ? 'approved' : tpl.status?.toLowerCase() === 'rejected' ? 'rejected' : 'pending',
          components: tpl.components || null,
          syncedAt: new Date(),
        },
        update: {
          category: tpl.category?.toLowerCase() || null,
          status: tpl.status?.toLowerCase() === 'approved' ? 'approved' : tpl.status?.toLowerCase() === 'rejected' ? 'rejected' : 'pending',
          components: tpl.components || null,
          syncedAt: new Date(),
        },
      })
      synced++
    }

    return NextResponse.json({ synced, total: templates.length })
  } catch (error) {
    console.error('Sync templates error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync templates' },
      { status: 500 }
    )
  }
}
