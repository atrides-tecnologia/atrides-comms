# Atrides Comms — Setup Inicial

**Data:** 2026-03-21
**Escopo:** Criação completa do projeto do zero até build funcional

---

## Features Completas

### Infraestrutura (Fase 1)
- Projeto Next.js 15 com App Router, TypeScript, Tailwind CSS v4
- Componentes UI estilo shadcn (Button, Input, Dialog, ScrollArea, Avatar, Badge, Separator, Tooltip)
- Prisma ORM com schema completo: `organizations`, `phone_numbers`, `conversations`, `messages`, `message_templates`
- Supabase client (frontend com anon key) e server (API routes com service role key)
- Zustand stores: `chatStore` (dados + seleção) e `uiStore` (sidebar, modais, filtros)
- next-themes com light/dark mode e variáveis CSS customizadas
- Google Fonts: DM Sans (headings) + IBM Plex Sans (body)

### Layout e Navegação (Fase 2)
- Layout 3 painéis: Sidebar (220px) + ConversationList (320px) + ChatPanel (flex)
- Header com logo, busca global e theme toggle
- Sidebar com projetos em árvore colapsável, números como sub-itens, badges de não lidas
- Sidebar responsiva (colapsável em telas < lg)
- Botões: Novo Projeto, Adicionar Número, Configurações

### Chat Core (Fase 3)
- Lista de conversas com busca, tabs (Todas / Não lidas / Arquivadas)
- Avatar com iniciais coloridas (geradas via hash do telefone)
- Preview da última mensagem, horário relativo (Agora, 2min, 1h, Ontem, 3d)
- Painel de chat com balões estilo WhatsApp (outbound azul à direita, inbound neutro à esquerda)
- Border-radius assimétrico nos balões conforme spec
- Status de mensagem: ✓ sent, ✓✓ delivered, ✓✓ azul read, ! failed
- Separadores por data (Hoje, Ontem, "15 de março")
- Input multiline com auto-resize (max 4 linhas), Enter envia, Shift+Enter quebra linha
- Scroll automático para última mensagem
- Supabase Realtime: hooks `useRealtimeMessages` e `useRealtimeConversations`
- Animação fade-in em novas mensagens (CSS `message-enter`)

### Webhook e Integração Meta (Fase 4)
- `GET /api/webhook` — verificação do webhook (busca verify token no banco)
- `POST /api/webhook` — recebe mensagens e status updates da Meta, parseia payload, cria/atualiza conversas, salva mensagens
- `POST /api/messages/send` — envia texto via Graph API v22.0, salva no banco
- `POST /api/messages/template` — envia template com variáveis dinâmicas
- `POST /api/templates/sync` — sincroniza templates aprovados da Meta (WABA)
- Parser completo do webhook: text, image, document, audio, video, sticker, location, reaction
- Extração de status updates (sent → delivered → read)

### Gestão (Fase 5)
- Modal Novo Projeto: nome + color picker (8 presets)
- Modal Adicionar Número: projeto, label, telefone, phone_number_id, waba_id, access_token (toggle show/hide), webhook_verify_token (auto-gerado), info box com instruções Meta
- Modal Enviar Template: seleção de template, campos dinâmicos para variáveis, preview
- Página Settings: webhook URL copiável, verify tokens por número, delete org/phone, sync templates, theme toggle
- CRUD completo: `GET/POST /api/organizations`, `PUT/DELETE /api/organizations/[id]`, `GET/POST /api/phones`, `PUT/DELETE /api/phones/[id]`, `GET /api/conversations`, `GET /api/conversations/[id]`

### Polish (Fase 6)
- Busca de conversas por nome, telefone ou conteúdo da última mensagem
- Estado vazio na lista de conversas e no painel de chat
- Seed com 3 orgs, 4 números, ~15 conversas, ~150 mensagens realistas
- Build passando sem erros de tipo

---

## Pendências

### Autenticação
- Login page existe mas é placeholder — não integra com Supabase Auth ainda
- Nenhuma rota protegida (API routes ou páginas)
- RLS (Row Level Security) não configurado nas tabelas do Supabase

### Realtime
- Hooks de realtime estão implementados mas dependem de Supabase Realtime estar habilitado no projeto (`ALTER PUBLICATION supabase_realtime ADD TABLE messages, conversations`)
- Deduplicação de mensagens no hook usa referência de `messages` que pode ficar stale (closure)

### UI
- Busca global no header não está funcional (só visual)
- Botão de arquivar conversa no chat header não implementa ação
- Botão de anexo desabilitado (futuro)
- Loading states e skeletons não implementados
- Favicon e notificações de browser não implementados
- Responsividade mobile parcial (sidebar colapsável, mas ConversationList e ChatPanel não adaptam)

### API / Meta
- Não há retry em caso de falha no envio para a Meta
- Não há validação de janela de 24h (fora da janela, só template)
- Não há download/armazenamento de mídia recebida (image, audio, etc. salvam apenas o media ID)
- Não há rate limiting nas API routes

### Banco
- Seed precisa de `DATABASE_URL` e `DIRECT_URL` configurados no `.env` para rodar
- Schema SQL do prompt (com `ALTER PUBLICATION`) precisa ser executado manualmente no Supabase

---

## Decisões Tomadas

- **Projeto criado manualmente** — `create-next-app` travava em prompts interativos no terminal, então o setup foi feito escrevendo cada arquivo diretamente
- **Tailwind CSS v4** — usado `@tailwindcss/postcss` e `@theme` ao invés de `tailwind.config.ts` (v4 syntax)
- **Variáveis CSS no tema** — cores definidas como CSS custom properties em `globals.css`, referenciadas via Tailwind (`bg-sidebar`, `bg-bubble-outbound`, etc.) ao invés de `tailwind.config` extend
- **Prisma + Supabase** — Prisma como ORM para queries no server-side, Supabase client direto para Realtime no frontend
- **Zustand sem middleware** — stores simples, sem persist, sem devtools por enquanto
- **Componentes UI manuais** — criados manualmente seguindo padrão shadcn ao invés de `npx shadcn-ui add`, para ter controle total e evitar dependências de CLI
- **`params` como Promise** — Next.js 15 exige `await params` em route handlers (breaking change)
- **Cast para `Prisma.InputJsonValue`** — necessário para contornar tipagem estrita de campos JSON do Prisma ao salvar `MessageContent`

---

## Próximos Passos

1. **Configurar Supabase** — criar projeto, copiar credenciais para `.env.local`, rodar `npx prisma db push`, executar SQL de Realtime, rodar seed
2. **Integrar Supabase Auth** — proteger rotas, middleware de autenticação, login funcional
3. **Configurar webhook na Meta** — apontar URL do deploy (ou ngrok local) para `/api/webhook`
4. **Testar fluxo completo** — enviar/receber mensagem real pelo WhatsApp
5. **Mídia** — download de imagens/docs recebidos, upload via Supabase Storage
6. **Loading states** — skeletons na sidebar, lista de conversas e mensagens
7. **Responsividade** — adaptar ConversationList e ChatPanel para mobile (drawer ou tab navigation)
8. **Notificações** — badge no favicon, notification API do browser
9. **Deploy Vercel** — configurar env vars, testar webhook em produção
