import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const organizations = [
  { name: 'Atrides', slug: 'atrides', color: '#0066FF' },
  { name: 'Cofrino', slug: 'cofrino', color: '#FF9500' },
  { name: 'Futbots', slug: 'futbots', color: '#34C759' },
]

const phones = [
  {
    orgSlug: 'atrides',
    label: 'Suporte',
    phoneNumber: '+5581951680136',
    phoneNumberId: '1042026558996907',
    wabaId: '963015662960133',
    accessToken: 'COLE_SEU_TOKEN_AQUI',
    webhookVerifyToken: 'atrides_suporte_verify_2024',
  },
  {
    orgSlug: 'atrides',
    label: 'Marketing',
    phoneNumber: '+5581999990001',
    phoneNumberId: 'MOCK_ID_1',
    wabaId: 'MOCK_WABA_1',
    accessToken: 'MOCK_TOKEN_1',
    webhookVerifyToken: 'atrides_mktg_verify_2024',
  },
  {
    orgSlug: 'cofrino',
    label: 'Suporte',
    phoneNumber: '+5581999990002',
    phoneNumberId: 'MOCK_ID_2',
    wabaId: 'MOCK_WABA_2',
    accessToken: 'MOCK_TOKEN_2',
    webhookVerifyToken: 'cofrino_suporte_verify_2024',
  },
  {
    orgSlug: 'cofrino',
    label: 'Nino',
    phoneNumber: '+5581999990003',
    phoneNumberId: 'MOCK_ID_3',
    wabaId: 'MOCK_WABA_3',
    accessToken: 'MOCK_TOKEN_3',
    webhookVerifyToken: 'cofrino_nino_verify_2024',
  },
]

const contacts = [
  { name: 'João Silva', phone: '+5581987654321' },
  { name: 'Maria Santos', phone: '+5581976543210' },
  { name: 'Pedro Oliveira', phone: '+5581965432109' },
  { name: 'Ana Costa', phone: '+5581954321098' },
  { name: 'Carlos Ferreira', phone: '+5581943210987' },
  { name: 'Lucia Mendes', phone: '+5581932109876' },
  { name: 'Roberto Alves', phone: '+5581921098765' },
  { name: 'Fernanda Lima', phone: '+5581910987654' },
]

const sampleMessages = [
  { direction: 'inbound', text: 'Olá, preciso de ajuda com meu pedido' },
  { direction: 'outbound', text: 'Olá! Claro, qual o número do seu pedido?' },
  { direction: 'inbound', text: 'É o pedido #4523' },
  { direction: 'outbound', text: 'Encontrei aqui. Seu pedido está em trânsito e deve chegar amanhã.' },
  { direction: 'inbound', text: 'Ótimo! Tem como rastrear?' },
  { direction: 'outbound', text: 'Sim! Aqui está o link de rastreio: https://rastreio.exemplo.com/4523' },
  { direction: 'inbound', text: 'Muito obrigado! 🙏' },
  { direction: 'outbound', text: 'Por nada! Qualquer dúvida é só chamar.' },
  { direction: 'inbound', text: 'Ah, mais uma coisa...' },
  { direction: 'outbound', text: 'Diga!' },
  { direction: 'inbound', text: 'Posso alterar o endereço de entrega?' },
  { direction: 'outbound', text: 'Infelizmente o pedido já saiu do CD. Mas posso verificar com a transportadora.' },
  { direction: 'inbound', text: 'Seria ótimo se conseguisse!' },
  { direction: 'outbound', text: 'Vou verificar e te retorno em alguns minutos ✓' },
  { direction: 'inbound', text: 'Ok, aguardo!' },
]

function randomDate(daysAgo: number): Date {
  const now = new Date()
  const ms = now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000
  return new Date(ms)
}

function randomStatus(): 'sent' | 'delivered' | 'read' {
  const r = Math.random()
  if (r < 0.3) return 'sent'
  if (r < 0.6) return 'delivered'
  return 'read'
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.messageTemplate.deleteMany()
  await prisma.phoneNumber.deleteMany()
  await prisma.organization.deleteMany()

  // Create organizations
  const orgMap: Record<string, string> = {}
  for (const org of organizations) {
    const created = await prisma.organization.create({ data: org })
    orgMap[org.slug] = created.id
    console.log(`  ✓ Org: ${org.name}`)
  }

  // Create phone numbers
  const phoneMap: Record<string, string> = {}
  for (const phone of phones) {
    const created = await prisma.phoneNumber.create({
      data: {
        organizationId: orgMap[phone.orgSlug],
        label: phone.label,
        phoneNumber: phone.phoneNumber,
        phoneNumberId: phone.phoneNumberId,
        wabaId: phone.wabaId,
        accessToken: phone.accessToken,
        webhookVerifyToken: phone.webhookVerifyToken,
      },
    })
    phoneMap[`${phone.orgSlug}-${phone.label}`] = created.id
    console.log(`  ✓ Phone: ${phone.label} (${phone.orgSlug})`)
  }

  // Create conversations and messages for each phone number
  const phoneIds = Object.values(phoneMap)
  let convCount = 0
  let msgCount = 0

  for (const phoneId of phoneIds) {
    // Pick 3-5 random contacts for this phone
    const shuffled = [...contacts].sort(() => Math.random() - 0.5)
    const numContacts = 3 + Math.floor(Math.random() * 3)
    const selectedContacts = shuffled.slice(0, numContacts)

    for (const contact of selectedContacts) {
      // Pick 8-15 messages from the sample
      const numMessages = 8 + Math.floor(Math.random() * 8)
      const selectedMessages = sampleMessages.slice(0, numMessages)
      const baseTime = randomDate(7)

      const lastMsg = selectedMessages[selectedMessages.length - 1]
      const unread = Math.random() > 0.6 ? Math.floor(Math.random() * 5) + 1 : 0

      const conversation = await prisma.conversation.create({
        data: {
          phoneNumberId: phoneId,
          contactPhone: contact.phone,
          contactName: contact.name,
          lastMessageAt: new Date(baseTime.getTime() + numMessages * 120000),
          lastMessagePreview: lastMsg.text.length > 50 ? lastMsg.text.slice(0, 50) + '...' : lastMsg.text,
          unreadCount: unread,
        },
      })
      convCount++

      for (let i = 0; i < selectedMessages.length; i++) {
        const msg = selectedMessages[i]
        const timestamp = new Date(baseTime.getTime() + i * 120000) // 2 min apart

        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            wamid: `wamid_${conversation.id}_${i}`,
            direction: msg.direction,
            type: 'text',
            content: { text: msg.text },
            status: msg.direction === 'outbound' ? randomStatus() : 'delivered',
            timestamp,
          },
        })
        msgCount++
      }
    }
  }

  console.log(`\n✅ Seed complete!`)
  console.log(`   ${organizations.length} organizations`)
  console.log(`   ${phones.length} phone numbers`)
  console.log(`   ${convCount} conversations`)
  console.log(`   ${msgCount} messages`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
