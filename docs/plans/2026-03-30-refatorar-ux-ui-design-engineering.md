# [US0000009] - Refatorar UX/UI com Design Engineering Moderno

**Data:** 2026-03-30
**Impact:** 4/5 | **Effort:** 4/5 | **Priority Score:** 16/25
**MVP Scope:** Modernizar a interface com design tokens, animacoes com proposito, micro-interacoes e polish visual seguindo principios de design engineering (Emil Kowalski).
**ClickUp:** [US0000009](https://app.clickup.com/t/86aghxvba) com 13 subtasks

## Contexto e Diagnostico

### Estado Atual (problemas identificados)

1. **Sem custom easing curves** -- usa apenas `transition-colors` e `ease-out` basico
2. **Botoes sem feedback tatil** -- sem `scale(0.97)` no `:active`
3. **Sem stagger animations** na lista de conversas
4. **Hierarquia visual plana** -- minimal shadows, sem depth, borders genericas
5. **Animacao de mensagem subotima** -- apenas `translateY(8px)` sem `scale`
6. **Zero suporte a `prefers-reduced-motion`**
7. **Dark mode com contraste baixo** -- bubbles inbound (#2d3139) proximos do background (#1a1d21)
8. **Tabs sem indicador animado** (sem sliding pill)
9. **Empty states estaticos**
10. **Input area sem focus glow** ou animacao no send button
11. **Fonts via Google Fonts URL** em vez de `next/font` (performance)
12. **Theme toggle sem animacao** -- troca instantanea de icone

### Principios Guia (Emil Kowalski)

1. Detalhes invisiveis se acumulam em algo impressionante
2. Animacoes com proposito -- ease-out para entradas, custom easing, max 300ms
3. Botoes com feedback tatil -- `scale(0.97)` no `:active`
4. Nunca animar de `scale(0)` -- comecar de `scale(0.95)` com opacity
5. Animar apenas `transform` e `opacity` para performance
6. Stagger animations para listas (30-80ms entre itens)
7. `prefers-reduced-motion` obrigatorio
8. Custom easing curves -- easings nativos do CSS sao fracos
9. CSS transitions sobre keyframes para UI interruptivel

## Criterios de Aceite

- [ ] Design tokens definidos (easing curves, duracoes, shadows, radii) no globals.css
- [ ] Botoes com feedback tatil (scale no :active) e transicoes suaves
- [ ] Inputs com focus glow animado
- [ ] Lista de conversas com stagger animation na entrada
- [ ] Mensagens entrando com scale(0.95) + opacity
- [ ] Tabs de filtro com sliding pill indicator animado
- [ ] Dark mode com cores refinadas e melhor contraste
- [ ] Light mode com visual limpo e sombras sutis
- [ ] Fonts carregadas via next/font
- [ ] prefers-reduced-motion respeitado em todas as animacoes
- [ ] Focus states visiveis e acessiveis
- [ ] Sidebar e panels com transicoes suaves
- [ ] Send button com animacao ao enviar
- [ ] Empty states com animacao de entrada sutil

## Tasks Created

### Wave 1 -- Fundacao (paralelas)
- [Fase 1] Design tokens e custom easing curves -- Complexity: M (86aghxwpg)
- [Fase 2] Migrar fonts para next/font -- Complexity: S (86aghxwxd)

### Wave 2 -- Component Polish (depende da Wave 1, paralelas entre si)
- [Fase 3] Polish de botoes (active states, hover, transitions) -- Complexity: M (86aghxx6f)
- [Fase 4] Polish de inputs e textarea (focus glow, transitions) -- Complexity: S (86aghxxcq)
- [Fase 5] Tabs com sliding pill indicator animado -- Complexity: M (86aghxxj5)

### Wave 3 -- Layout e Cores (depende da Wave 1, paralelas entre si)
- [Fase 6] Refinar paleta de cores dark/light mode -- Complexity: M (86aghxxxr)
- [Fase 7] Melhorar layout (shadows, borders, spacing, depth) -- Complexity: M (86aghxy67)

### Wave 4 -- Animacoes (depende da Wave 1, paralelas entre si)
- [Fase 8] Stagger animation na conversation list -- Complexity: M (86aghxyhq)
- [Fase 9] Animacao de mensagens (scale + opacity) -- Complexity: S (86aghxypj)
- [Fase 10] Sidebar e panel transitions suaves -- Complexity: S (86aghxyy7)

### Wave 5 -- Micro-interacoes (depende das Waves 2+4)
- [Fase 11] Send button animation e empty states entrance -- Complexity: S (86aghxz84)
- [Fase 12] Theme toggle animation -- Complexity: S (86aghxzd9)

### Wave 6 -- Acessibilidade (depende de todas as animacoes)
- [Fase 13] Acessibilidade (prefers-reduced-motion e focus states) -- Complexity: M (86aghxzqx)

## Plano de Execucao Paralela

- **Wave 1** (simultaneo): 2 tasks -- fundacao de tokens e fonts
- **Wave 2** (apos Wave 1): 3 tasks -- polish de componentes interativos
- **Wave 3** (apos Wave 1): 2 tasks -- cores e layout (paralela com Wave 2)
- **Wave 4** (apos Wave 1): 3 tasks -- animacoes (paralela com Waves 2 e 3)
- **Wave 5** (apos Waves 2+4): 2 tasks -- micro-interacoes
- **Wave 6** (apos tudo): 1 task -- acessibilidade
- **Max parallel branches:** 3 (Waves 2, 3, 4 rodam simultaneamente)

## Riscos

- Animacoes excessivas podem degradar performance em dispositivos moveis
- Mudanca de paleta dark mode pode quebrar contraste em componentes nao mapeados
- Migracao de font pode causar FOUT se mal configurada
- Sliding pill tabs requer medicao de DOM -- pode ter edge cases com resize
