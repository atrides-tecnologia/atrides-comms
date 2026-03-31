# OWASP Top 10 Security Audit — atrides-comms

**Data:** 2026-03-31
**Branch:** `feat/86agh6b8u-owasp-security-fixes`
**Escopo:** Todas as rotas API, middleware, auth, integracao externa

## Resumo

| Severidade | Total | Corrigidos | Abertos |
|-----------|-------|------------|---------|
| CRITICAL | 1 | 0 | 1 |
| HIGH | 7 | 2 | 5 |
| MEDIUM | 7 | 0 | 7 |
| LOW | 7 | 0 | 7 |
| INFO | 5 | 3 | 2 |

## Findings

### CRITICAL

| ID | Categoria | Descricao | Status |
|----|-----------|-----------|--------|
| A01-1 | Broken Access Control | Sem isolamento de tenant — qualquer usuario autenticado acessa dados de qualquer org | OPEN |

### HIGH

| ID | Categoria | Descricao | Status |
|----|-----------|-----------|--------|
| A01-2 | Broken Access Control | Sem RBAC — todos os usuarios tem poderes de admin | OPEN |
| A01-3 | Broken Access Control | IDOR em todas as rotas parametrizadas | OPEN |
| A02-1 | Cryptographic Failures | Access tokens armazenados em texto plano no banco | OPEN |
| A04-1 | Insecure Design | Sem rate limiting em nenhum endpoint | OPEN |
| A05-2 | Security Misconfiguration | Validacao de signature do webhook e opcional | OPEN — corrigido parcialmente (valida quando META_APP_SECRET existe) |
| A07-1 | Authentication Failures | Open redirect no auth callback (`next` param) | OPEN |
| A09-1 | Logging Failures | Sem logging estruturado ou audit trail | OPEN |

### MEDIUM

| ID | Categoria | Descricao | Status |
|----|-----------|-----------|--------|
| A02-3 | Cryptographic Failures | Geracao fraca de webhook verify token (Math.random) | OPEN |
| A03-1 | Injection | Sem validacao de tamanho em mensagens de texto | OPEN |
| A03-3 | Injection | Template components passados sem validacao de schema | OPEN |
| A04-2 | Insecure Design | Sem paginacao em queries de listagem | OPEN |
| A05-1 | Security Misconfiguration | Sem security headers (CSP, HSTS, etc.) | OPEN |
| A08-2 | Data Integrity | Sem protecao CSRF em endpoints de mutacao | OPEN |
| A09-2 | Logging Failures | Erros do webhook engolidos silenciosamente | OPEN |

### CORRIGIDOS nesta US

| ID | Categoria | Descricao | Fix |
|----|-----------|-----------|-----|
| A01-4 | Broken Access Control | RLS habilitado nas 5 tabelas | Migration SQL aplicada |
| A02-2 | Cryptographic Failures | accessToken removido das responses da API | select/destructuring em phones e organizations |
| A08-1 | Data Integrity | Validacao de signature no webhook | HMAC SHA256 + timingSafeEqual |

## Ordem de Remediacao Recomendada

1. **A01-1 (CRITICAL):** Implementar autorizacao por tenant. Cada rota deve verificar que o usuario pertence a org sendo acessada.
2. **A07-1 (HIGH):** Validar parametro `next` no auth callback para aceitar apenas paths relativos.
3. **A05-2 (HIGH):** Tornar META_APP_SECRET obrigatorio; falhar se nao configurado.
4. **A04-1 (HIGH):** Adicionar rate limiting nos endpoints criticos (send message, auth).
5. **A02-1 (HIGH):** Encriptar access tokens em repouso (AES-256-GCM).
6. **A09-1 (HIGH):** Implementar logging estruturado com atribuicao de usuario.
7. **A01-2 (HIGH):** Implementar RBAC para operacoes destrutivas.
