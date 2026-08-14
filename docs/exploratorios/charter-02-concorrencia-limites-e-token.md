# Charter Exploratório 02 — Duplicidade, limites numéricos e segurança de token

**Missão:** Explorar cenários de duplicidade de dados (email), limites numéricos/tamanho de payload e a robustez da validação do token JWT (adulteração e expiração).

**Heurística de apoio:** SFDPOT (foco em **Data** e **Operations**) + checagem de segurança básica no fluxo de autenticação.

**Duração da sessão:** ~25 minutos
**Ambiente:** API local (`npm run dev`), via curl e scripts Node ad-hoc

## Notas da sessão

| # | Ação | Esperado | Observado | Veredito |
|---|---|---|---|---|
| 1 | Registrar `CaseTeste@Exemplo.com`, depois registrar `caseteste@exemplo.com` | 409 (email já existe, case-insensitive) | 201 — os dois registros são aceitos como usuários diferentes | 🐞 Bug — ver Issue "email tratado como case-sensitive" |
| 2 | Criar duas despesas (0.1 e 0.2) e conferir o resumo mensal | `totalGeral: 0.3` | `totalGeral: 0.30000000000000004` (erro de ponto flutuante) | 🐞 Bug — ver Issue "precisão de ponto flutuante no resumo" |
| 3 | Criar despesa com `valor: 1e308` | 400 (fora de um limite razoável) | 201, aceito sem nenhuma validação de teto | 🐞 Bug — ver Issue "sem limite máximo de valor" |
| 4 | Criar despesa com `descricao` de 200.000 caracteres (> 100kb, limite padrão do `express.json`) | 413 (Payload Too Large) | 500 (Internal Server Error) — o middleware de erro não trata `PayloadTooLargeError` | 🐞 Bug — ver Issue "payload grande retorna 500 em vez de 413" (relacionada à Issue #5) |
| 5 | Adulterar o payload de um token JWT válido sem reassinar, e usá-lo | 401 (assinatura inválida) | 401 | OK — validação de assinatura funcionando corretamente |
| 6 | Gerar um token com expiração de 1s, aguardar 1.5s e usá-lo | 401 (token expirado) | 401 | OK — validação de expiração funcionando corretamente |

## Resumo da sessão
De 6 variações testadas, 4 revelaram problemas reais: duplicidade de usuários por diferença de maiúsculas/minúsculas no email, erro clássico de ponto flutuante no somatório de valores monetários, ausência de limite superior para o campo `valor`, e tratamento genérico (500) para erros de payload grande que deveriam retornar 413. Por outro lado, a camada de autenticação JWT se mostrou robusta contra adulteração de payload e expiração de token.

## Próximas sessões sugeridas
- Explorar comportamento sob concorrência real (requisições simultâneas de registro com o mesmo email, race condition)
- Explorar paginação/desempenho com grande volume de despesas por usuário (milhares de registros)
- Explorar tentativas de login repetidas (ausência de rate limiting / bloqueio por tentativas)
