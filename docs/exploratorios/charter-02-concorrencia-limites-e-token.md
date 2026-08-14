# Charter Exploratório 02 — Duplicidade, limites numéricos e segurança de token

Segunda rodada. Peguei as três ideias que anotei no fim da sessão passada e mudei um pouco o foco: dessa vez fui atrás de duplicidade (email repetido de formas diferentes), números nos extremos, e se dava pra enganar o JWT de alguma forma.

**Missão:** testar duplicidade de dados, limites numéricos/tamanho de payload, e o quanto o token JWT resiste a adulteração e expiração.

Usei SFDPOT de novo como referência (Data e Operations), mas dessa vez com mais scripts em Node ad-hoc do que curl puro, porque precisava montar token adulterado e coisas assim — deu pra fazer em uns 25 minutos.

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
4 de 6 testes acusaram problema. O da duplicidade de email por causa da caixa (maiúscula/minúscula) eu meio que já desconfiava, mas confirmar foi bom. O de ponto flutuante é clássico (0.1 + 0.2 não dá 0.3 em JS, todo mundo já caiu nessa uma vez), só que numa API de gastos isso é chato de verdade — o usuário vai ver um total tipo "R$ 0,30000000000000004" e vai achar que o sistema tá quebrado. Também não tem limite de valor máximo, e payload grande demais estoura como erro 500 em vez de 413.

O lado bom: tentei adulterar o token e forçar expiração, e nos dois casos a API barrou certinho com 401. Pelo menos essa parte está sólida.

## Próximas sessões
- Testar concorrência de verdade (duas requisições de registro simultâneas pro mesmo email — não só sequenciais)
- Ver como a API se comporta com muitas despesas cadastradas (será que aguenta bem sem paginação?)
- Login: tentar várias senhas erradas seguidas e ver se existe algum tipo de bloqueio
