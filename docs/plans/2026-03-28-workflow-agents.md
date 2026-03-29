# [US0000002] - Melhorar workflow de desenvolvimento (agents PM, Reviewer, QA + docs)

**Data:** 2026-03-28
**ClickUp:** https://app.clickup.com/t/86aggygu3
**Status:** Backlog

---

## Scoring

- **Impact:** 4/5 — Melhora significativa no workflow, automacao do ciclo de vida de tasks
- **Effort:** 3/5 — Varios arquivos novos (configs/markdown), sem codigo complexo
- **Priority Score:** 12/25 -> High (por decisao do solicitante)

## MVP Scope

Expandir o agent PM com gestao de status no ClickUp + criar agents Reviewer e QA com capacidades basicas + documentar o workflow completo.

## Criterios de Aceite

- [ ] Agent PM consegue mover tasks entre todos os estagios do ClickUp
- [ ] Agent PM consegue finalizar subtasks (marcar como done)
- [ ] Agent PM consegue atualizar descricoes com progresso
- [ ] Agent Reviewer existe e consegue revisar codigo, verificar criterios de aceite, mover tasks para In Review, e comentar no ClickUp
- [ ] Agent QA existe e consegue testar features, gerar evidencias, anexar no ClickUp, e mover tasks para In Test
- [ ] Documentacao do workflow completo existe em docs/ com diagrama dos estagios e agents

## Tasks

### Wave 1 (parallel)

| Track | Task | Complexity | ClickUp ID |
|-------|------|------------|------------|
| A | Expandir agent PM com gestao de status e progresso no ClickUp | M | [86aggyguk](https://app.clickup.com/t/86aggyguk) |
| B | Criar agent Reviewer (.claude/agents/reviewer.md) | M | [86aggyguv](https://app.clickup.com/t/86aggyguv) |
| C | Criar agent QA (.claude/agents/qa.md) | M | [86aggyguy](https://app.clickup.com/t/86aggyguy) |

### Wave 2 (depends on Wave 1)

| Track | Task | Complexity | ClickUp ID |
|-------|------|------------|------------|
| D | Criar documentacao do workflow de desenvolvimento (docs/workflow.md) | S | [86aggygv6](https://app.clickup.com/t/86aggygv6) |

## Parallel Execution Plan

- **Wave 1** (simultaneous): 3 tasks (Tracks A, B, C)
- **Wave 2** (after Wave 1): 1 task (Track D)
- **Max parallel branches:** 3

## Estagios do ClickUp

```
Backlog -> In Development -> In Review -> In Test -> Done -> Deployed
                                   |                  ^
                                   v                  |
                                Blocked ──────────────┘

Cancelled (qualquer estagio)
```

## Riscos e Observacoes

- **Playwright MCP** necessario para o agent QA capturar screenshots — verificar se esta disponivel no ambiente
- **clickup_attach_task_file** pode ter limitacoes de tamanho — testar com screenshots reais
- Agents sao arquivos markdown de configuracao, nao codigo executavel — a qualidade depende da clareza das instrucoes
