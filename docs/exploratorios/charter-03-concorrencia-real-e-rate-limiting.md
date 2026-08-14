# Charter Exploratório 03 — Concorrência real e rate limiting

**Missão:** Disparar requisições verdadeiramente concorrentes (via `Promise.all`, sem esperar uma responder antes da próxima) contra endpoints sensíveis a condição de corrida, e verificar se existe alguma proteção contra força bruta no login.

**Heurística de apoio:** SFDPOT (foco em **Operations**), com ênfase em concorrência e abuso de endpoint.

**Duração da sessão:** ~15 minutos
**Ambiente:** API local (`npm run dev`), via script Node com `fetch` e `Promise.all`

## Notas da sessão

| # | Ação | Esperado | Observado | Veredito |
|---|---|---|---|---|
| 1 | Disparar 10 registros simultâneos com o mesmo email | Apenas 1 deveria ter sucesso (201), os demais 409 | Exatamente 1 sucesso (201), 9 com 409 | OK — sem condição de corrida no registro |
| 2 | Disparar 30 tentativas de login com senha errada em sequência rápida, para o mesmo usuário | Deveria haver algum bloqueio/limite (ex: 429) a partir de N tentativas | Todas as 30 retornaram 401, nenhuma bloqueada | 🐞 Gap — ver Issue "sem rate limiting no login" |
| 3 | Disparar 5 exclusões simultâneas da mesma despesa | Apenas 1 deveria ter sucesso (204), as demais 404 | Exatamente 1 sucesso (204), 4 com 404 | OK — sem condição de corrida na exclusão |

## Resumo da sessão
Os testes de concorrência real (registro duplicado e exclusão da mesma despesa) não revelaram condições de corrida — resultado esperado, já que o modelo de execução single-threaded do Node.js processa cada handler de forma síncrona até o próximo ponto de I/O, sem interleaving entre as operações de verificação e escrita usadas neste projeto.

O ponto de atenção real desta sessão foi a ausência total de rate limiting no endpoint de login: 30 tentativas de senha incorreta em sequência não sofreram nenhum tipo de bloqueio, throttling ou aumento de delay, o que deixa o endpoint vulnerável a ataques de força bruta.

## Próximas sessões sugeridas
- Explorar o comportamento da API sob um volume alto de despesas por usuário (paginação/desempenho em listagens grandes)
- Explorar cabeçalhos HTTP de segurança ausentes (ex: CORS, Helmet) já que a API não define nenhum
