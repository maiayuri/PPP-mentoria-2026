# Charter Exploratório 03 — Concorrência real e rate limiting

Última rodada dessa vez. Nas sessões anteriores eu só mandava requisições uma atrás da outra — aqui eu quis simular de verdade duas coisas acontecendo ao mesmo tempo, usando `Promise.all` pra disparar tudo junto sem esperar resposta. Também aproveitei pra checar uma coisa que fiquei curioso desde o começo: dá pra tentar logar quantas vezes eu quiser sem ser bloqueado?

Rodei um script Node com `fetch` + `Promise.all`, levou uns 15 minutos.

## Notas da sessão

| # | Ação | Esperado | Observado | Veredito |
|---|---|---|---|---|
| 1 | Disparar 10 registros simultâneos com o mesmo email | Apenas 1 deveria ter sucesso (201), os demais 409 | Exatamente 1 sucesso (201), 9 com 409 | OK — sem condição de corrida no registro |
| 2 | Disparar 30 tentativas de login com senha errada em sequência rápida, para o mesmo usuário | Deveria haver algum bloqueio/limite (ex: 429) a partir de N tentativas | Todas as 30 retornaram 401, nenhuma bloqueada | 🐞 Gap — ver Issue "sem rate limiting no login" |
| 3 | Disparar 5 exclusões simultâneas da mesma despesa | Apenas 1 deveria ter sucesso (204), as demais 404 | Exatamente 1 sucesso (204), 4 com 404 | OK — sem condição de corrida na exclusão |

## Resumo da sessão
Fiquei meio surpreso, mas de forma boa: nem o registro duplicado nem a exclusão da mesma despesa quebraram sob concorrência real. Pensando depois, faz sentido — o Node roda tudo num único thread e cada handler termina antes do próximo começar, então não teve brecha pra dois requests "colidirem" no meio da checagem.

Já o login me confirmou uma suspeita: não tem rate limiting nenhum. Mandei 30 tentativas com senha errada de uma vez, todas voltaram 401 tranquilamente, sem nenhum bloqueio. Na prática isso deixa a porta aberta pra um ataque de força bruta.

## Ideias pra continuar (se der tempo)
- Ver como a API se sai com um volume grande de despesas cadastradas de uma vez
- Checar se faltam headers de segurança (CORS, Helmet) — acho que a API não define nenhum hoje
