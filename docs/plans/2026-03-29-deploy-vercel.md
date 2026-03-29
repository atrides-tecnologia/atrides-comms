## [US0000003] - Deploy do atrides-comms na Vercel (Hobby plan)

**Impact:** 5/5 | **Effort:** 2/5 | **Priority Score:** 25/25
**MVP Scope:** Fazer o primeiro deploy do app na Vercel com todas as env vars configuradas, app funcional em producao, e webhook da Meta apontando para a URL de producao.
**ClickUp:** Criado — [US0000003] com 5 subtasks

### Criterios de Aceite
- [ ] Codigo pushed para o repositorio GitHub
- [ ] Projeto criado na Vercel conectado ao repo GitHub
- [ ] Todas as variaveis de ambiente configuradas na Vercel
- [ ] Build e deploy com sucesso (sem erros)
- [ ] App acessivel via URL da Vercel (pagina carrega, dados do Supabase aparecem)
- [ ] Webhook da Meta atualizado para apontar para `https://<vercel-url>/api/webhook`
- [ ] Webhook verificado com sucesso pela Meta (GET retorna challenge)
- [ ] Mensagens recebidas via WhatsApp chegam no app em producao

### Tasks Created

#### Wave 1 (sequencial)
- [Fase 1] Push do codigo para o GitHub — Complexidade: S (86agh339j)
- [Fase 2] Conectar repo na Vercel e configurar env vars — Complexidade: M (86agh32qt)

#### Wave 2 (depende da Wave 1)
- [Fase 3] Primeiro deploy e validacao basica — Complexidade: S (86agh335t)
- [Fase 4] Atualizar webhook da Meta para URL de producao — Complexidade: S (86agh337t)

#### Wave 3 (depende da Wave 2)
- [Fase 5] Teste end-to-end com WhatsApp real em producao — Complexidade: S (86agh338a)

### Plano de Execucao
- **Wave 1** (sequencial): 2 tasks — push e setup Vercel
- **Wave 2** (apos Wave 1): 2 tasks — deploy e webhook
- **Wave 3** (apos Wave 2): 1 task — teste E2E
- **Max parallel branches:** 1 (todas as fases sao sequenciais neste caso)

### Riscos
- Prisma generate: garantir que `postinstall` script existe no package.json
- Hobby plan: timeout de 10s nas serverless functions (webhook handler precisa ser rapido)
- Env vars NEXT_PUBLIC_: inlined no build, precisam re-deploy se mudarem
- Webhook verify token: deve bater com o valor no banco de dados
