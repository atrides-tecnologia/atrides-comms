# [US0000006] - Melhorar UX do atrides-comms (loading states, responsividade, estados vazios)

**Impact:** 4/5 | **Effort:** 3/5 | **Priority Score:** 20/25
**MVP Scope:** Implementar loading states, responsividade mobile no layout principal, acao de arquivar conversa, e estados vazios contextuais para eliminar telas em branco e tornar o app usavel em dispositivos moveis.
**ClickUp:** Criado — [US0000006](https://app.clickup.com/t/86aghcd2w) com 6 subtasks

## Referências Visuais

Imagens de referência em: `docs/references/2026-03-30-melhorar-ux-loading-responsividade/`

- `chat-example-1.webp` — Layout 3 painéis com painel direito colapsado (ícones)
- `chat-example-2.webp` — Layout 3 painéis com painel direito expandido (Shared files)

**IMPORTANTE:** Essas imagens servem como guia visual de estilo e layout, NÃO como spec de funcionalidades.
Usar como referência para:
- Proporções e hierarquia dos painéis
- Estilo de bolhas de mensagem, espaçamento e tipografia
- Padrão de lista de conversas (avatar, preview, timestamp)
- Comportamento de painel colapsável/expansível (relevante para Fase 5)

NÃO implementar funcionalidades que aparecem nas imagens mas não estão no escopo desta US
(ex: status online, typing indicator, shared files, reações, emojis).

Novas imagens de referência podem ser adicionadas na mesma pasta seguindo o padrão `fase-N-descricao.png`.

## Contexto

- O app atualmente nao tem nenhum indicador de carregamento — o usuario ve paineis em branco enquanto dados sao buscados via fetch em useEffect
- O layout e fixo com `w-[320px]` (ConversationList) e `w-[220px]` (Sidebar), impossibilitando uso mobile
- A busca global no Header nao tem onChange/state — e puramente decorativa
- O botao de arquivar no ChatPanel nao tem onClick — e um no-op
- Nao existe favicon customizado nem diretorio public/
- Estados vazios sao minimos: so existe EmptyChat para "nenhuma conversa selecionada"
- Erros de envio de mensagem so aparecem no console.error, sem feedback visual

## Criterios de Aceite

- [ ] Ao carregar organizacoes, conversas e mensagens, o usuario ve skeletons/spinners em vez de telas em branco
- [ ] O layout adapta corretamente em telas < 768px: sidebar collapsa, conversation list e chat panel alternam via navegacao
- [ ] A busca no Header e removida (decorativa, sem funcao)
- [ ] O botao de arquivar conversa funciona (PATCH status para archived e atualiza UI)
- [ ] Favicon customizado do Atrides Comms esta presente
- [ ] Estados vazios contextuais existem para: nenhuma org, nenhum telefone selecionado, nenhuma conversa na lista
- [ ] Feedback visual de erro ao falhar envio de mensagem (toast ou inline)

## Tasks Created

### Wave 1 (parallel)
- [Fase 1] Loading states e skeletons nos componentes principais — Complexity: M — [86aghcdc6](https://app.clickup.com/t/86aghcdc6)
- [Fase 2] Favicon e metadados basicos — Complexity: S — [86aghcdh8](https://app.clickup.com/t/86aghcdh8)
- [Fase 3] Estados vazios contextuais — Complexity: M — [86aghcdu2](https://app.clickup.com/t/86aghcdu2)
- [Fase 4] Implementar acao de arquivar conversa — Complexity: M — [86aghce1k](https://app.clickup.com/t/86aghce1k)

### Wave 2 (depends on Wave 1)
- [Fase 5] Responsividade mobile do layout principal — Complexity: L — [86aghcebv](https://app.clickup.com/t/86aghcebv)
- [Fase 6] Remover busca decorativa do Header e feedback de erro no envio — Complexity: S — [86aghcejx](https://app.clickup.com/t/86aghcejx)

## Parallel Execution Plan

- **Wave 1** (simultaneous): 4 tasks — loading states, favicon, empty states, archive action
- **Wave 2** (after Wave 1): 2 tasks — mobile responsiveness, cleanup/error feedback
- **Max parallel branches:** 4

## Riscos

- Responsividade mobile (Fase 5) pode exigir refactor significativo do layout em ChatPage (de 3 paineis fixos para navegacao condicional)
- A acao de arquivar precisa verificar se rota PATCH ja existe em /api/conversations/[id]
- Fases 1, 3 e 5 tocam nos mesmos componentes (ConversationList, ChatPanel) — por isso 5 depende de 1 e 3

## Dependencias entre Fases

```
Fase 1 (loading) ──┐
Fase 2 (favicon)    │── Wave 1 (paralelas)
Fase 3 (empty)   ──┤
Fase 4 (archive)    │
                    ▼
Fase 5 (mobile) ──── Wave 2 (depende de 1, 3)
Fase 6 (cleanup) ── Wave 2 (depende de 1)
```
