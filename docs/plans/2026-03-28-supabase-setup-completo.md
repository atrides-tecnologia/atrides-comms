## US - Setup Completo do Supabase

**Impact:** 5/5 | **Effort:** 2/5 | **Priority Score:** 25/25
**MVP Scope:** Configurar Supabase do zero para que o app funcione end-to-end (banco, realtime, seed, auth)
**ClickUp:** Criado -- task pai [86aggx476](https://app.clickup.com/t/86aggx476) com 6 subtasks

### Criterios de Aceite

- [ ] `.env.local` com credenciais reais e `.env.example` criado
- [ ] 5 tabelas criadas no Supabase (organizations, phone_numbers, conversations, messages, message_templates)
- [ ] Realtime habilitado para messages e conversations
- [ ] Seed executado (~150 mensagens, ~15 conversas)
- [ ] Supabase Auth funcionando (login com email/password)
- [ ] Middleware protegendo rotas (publico: /login, /api/webhook)
- [ ] `npm run dev` funcional com dados reais

### Tasks Created

#### Wave 1
- [x] [Fase 1] Configurar variaveis de ambiente -- Complexidade: S -- [86aggx49j](https://app.clickup.com/t/86aggx49j)

#### Wave 2 (depende de Wave 1)
- [ ] [Fase 2] Criar tabelas no Supabase via Prisma -- Complexidade: S -- [86aggx4a5](https://app.clickup.com/t/86aggx4a5)

#### Wave 3 (depende de Wave 2, paralelo entre si)
- [ ] [Fase 3] Habilitar Realtime -- Complexidade: S -- [86aggx4b8](https://app.clickup.com/t/86aggx4b8)
- [ ] [Fase 4] Executar seed -- Complexidade: S -- [86aggx4c7](https://app.clickup.com/t/86aggx4c7)

#### Wave 4 (depende de Wave 2)
- [ ] [Fase 5] Implementar Supabase Auth -- Complexidade: M -- [86aggx4d8](https://app.clickup.com/t/86aggx4d8)

#### Wave 5 (depende de todas)
- [ ] [Fase 6] Verificacao final end-to-end -- Complexidade: S -- [86aggx4ef](https://app.clickup.com/t/86aggx4ef)

### Parallel Execution Plan

- **Wave 1** (sequencial): 1 task -- env vars
- **Wave 2** (sequencial): 1 task -- prisma db push
- **Wave 3** (paralelo): 2 tasks -- realtime + seed
- **Wave 4** (paralelo com Wave 3): 1 task -- auth
- **Wave 5** (sequencial): 1 task -- verificacao
- **Max parallel branches:** 3 (Fase 3 + Fase 4 + Fase 5)

### Riscos

- Senha do banco contem `@`, precisa URL-encoding (`%40`) nas connection strings
- Dependencia sequencial forte entre Fases 1-2 (nada roda sem env vars e tabelas)
