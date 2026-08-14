# Charter Exploratório 01 — Validações de entrada em Despesas e Autenticação

Depois de fechar os casos de teste "óbvios", resolvi caçar coisa que eu não tinha coberto ainda: o que acontece quando mando dado torto pra API? Formato errado, tipo trocado, string onde devia ter número. Essa foi minha primeira sessão de verdade nessa linha.

**Missão:** achar falhas de validação em `/auth` e `/despesas` usando dados de fronteira e formatos malformados que os casos de teste "funcionais" não cobrem.

**Apoio:** usei a heurística SFDPOT como guia mental, focando em **Data** e **Function** — troquei tipos, formatos de data/mês e mandei strings quebradas de propósito.

Rodei isso por uns 30 minutos, com a API local (`npm run dev`) e o curl.

## Notas da sessão

| # | Ação | Esperado | Observado | Veredito |
|---|---|---|---|---|
| 1 | `GET /despesas/resumo?mes=2026-13` (mês 13 não existe) | 400 (mês inválido) | 200, retorna resumo vazio silenciosamente | 🐞 Bug — ver Issue "resumo/filtro não valida formato do mês" |
| 2 | `POST /despesas` com `categoria: "Alimentacao"` (maiúscula) | 400 (categoria não bate com a lista) | 400 | OK |
| 3 | `POST /despesas` com `valor: "10"` (string numérica) | 400 (tipo incorreto) | 400 | OK |
| 4 | `POST /despesas` com `data: "ontem"` (não é uma data real) | 400 (data inválida) | 201, despesa criada com `data: "ontem"` | 🐞 Bug — ver Issue "campo data não valida formato" |
| 5 | Requisição autenticada com header `Authorization: Bearer` (sem token) | 401 | 401 | OK |
| 6 | `POST /despesas` com corpo JSON malformado (`{valor:10,}`) | 400 (Bad Request) | 500 (Internal Server Error) | 🐞 Bug — ver Issue "JSON malformado retorna 500" |
| 7 | Registro com email contendo espaços (`"  espaco@teste.com  "`) | Deveria normalizar (trim) ou rejeitar | Salvo literalmente com espaços; login subsequente com o email "limpo" falha com 401 | 🐞 Bug — ver Issue "email não é validado/normalizado" |

## Resumo da sessão
Testei 7 variações e 4 deram problema — mais do que eu esperava, sinceramente. Os itens 1, 4 e 7 mostram que faltou validar formato mesmo (mês, data, email). O item 6 me chamou mais atenção: um JSON mal formado quebra o parser e o erro vaza como 500, quando deveria ser um 400 simples (culpa é do cliente, não do servidor).

## Próximas sessões
Ainda quero:
- Ver o que acontece com payloads gigantes (string enorme em `nome`/`descricao`)
- Testar concorrência de verdade — duas requisições de registro com o mesmo email, disparadas juntas
- Mexer com o token JWT: adulterar ele e ver se expira direito
