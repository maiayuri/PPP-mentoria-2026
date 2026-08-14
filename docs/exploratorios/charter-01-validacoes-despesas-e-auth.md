# Charter Exploratório 01 — Validações de entrada em Despesas e Autenticação

**Missão:** Explorar as validações de entrada dos endpoints de `/auth` e `/despesas`, usando dados de fronteira, tipos inconsistentes e formatos malformados, para encontrar falhas de validação não cobertas pelos casos de teste funcionais.

**Heurística de apoio:** SFDPOT (foco em **Data** e **Function**) — variação de tipos de dado, formatos de data/mês, strings malformadas.

**Duração da sessão:** ~30 minutos
**Ambiente:** API local (`npm run dev`), via curl

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
De 7 variações testadas, 4 revelaram falhas de validação reais. Os itens 1, 4 e 7 indicam ausência de validação de formato (mês, data, email). O item 6 é mais sério: um erro de parsing do corpo da requisição não tratado está vazando como erro 500, quando deveria ser um 400 (entrada inválida do cliente).

## Próximas sessões sugeridas
- Explorar limites de tamanho de payload (strings muito longas em `nome`/`descricao`)
- Explorar concorrência (duas requisições de registro simultâneas com o mesmo email)
- Explorar expiração e adulteração do token JWT
