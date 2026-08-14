# Casos de Teste — API de Controle de Gastos Pessoais

Aqui estão os casos de teste que escrevi pra cobrir os fluxos principais da API. Uso a convenção `CT-<área>-<número>` e cada caso tem status Passou, Falhou ou Bloqueado. Boa parte acabei automatizando com Jest/Supertest conforme fui evoluindo a suíte; os que ficaram só como validação manual, deixei marcado.

## Autenticação

### CT-AUTH-01 — Registro de usuário com dados válidos
- **Pré-condição:** nenhum usuário cadastrado com o email usado
- **Passos:** `POST /auth/registro` com `nome`, `email` e `senha` válidos
- **Resultado esperado:** status 201, corpo com `id`, `nome`, `email` (sem `senhaHash`)
- **Status:** Passou (coberto por teste automatizado)

### CT-AUTH-02 — Registro com email já cadastrado
- **Passos:** registrar um usuário; repetir o registro com o mesmo email
- **Resultado esperado:** status 409
- **Status:** Passou (coberto por teste automatizado)

### CT-AUTH-03 — Registro com campos obrigatórios ausentes
- **Passos:** `POST /auth/registro` sem `senha`
- **Resultado esperado:** status 400
- **Status:** Passou (coberto por teste automatizado)

### CT-AUTH-04 — Login com credenciais válidas
- **Passos:** registrar usuário; `POST /auth/login` com email/senha corretos
- **Resultado esperado:** status 200, corpo com `token` (JWT)
- **Status:** Passou (coberto por teste automatizado)

### CT-AUTH-05 — Login com senha incorreta
- **Resultado esperado:** status 401
- **Status:** Passou (coberto por teste automatizado)

### CT-AUTH-06 — Login com email inexistente
- **Resultado esperado:** status 401 (sem indicar se o problema foi o email ou a senha, evitando enumeração de usuários)
- **Status:** Passou (coberto por teste automatizado)

## Despesas

### CT-DESP-01 — Criar despesa com dados válidos
- **Pré-condição:** usuário autenticado
- **Resultado esperado:** status 201, despesa retornada com `id`
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-02 — Criar despesa sem token de autenticação
- **Resultado esperado:** status 401
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-03 — Criar despesa com valor negativo
- **Resultado esperado:** status 400
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-04 — Criar despesa com valor igual a zero
- **Passos:** `POST /despesas` com `valor: 0`
- **Resultado esperado:** status 400 (valor deve ser maior que zero)
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-05 — Criar despesa com categoria inválida
- **Resultado esperado:** status 400
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-06 — Listar despesas retorna apenas as do usuário autenticado
- **Resultado esperado:** despesas de outro usuário não aparecem na listagem
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-07 — Filtrar despesas por categoria
- **Passos:** criar despesas em categorias diferentes; `GET /despesas?categoria=lazer`
- **Resultado esperado:** apenas despesas da categoria informada são retornadas
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-08 — Acessar despesa de outro usuário pelo id
- **Resultado esperado:** status 403
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-09 — Consultar despesa inexistente
- **Resultado esperado:** status 404
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-10 — Excluir despesa existente
- **Resultado esperado:** status 204; consulta posterior retorna 404
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-11 — Excluir despesa já excluída
- **Passos:** excluir uma despesa; repetir a exclusão do mesmo id
- **Resultado esperado:** status 404 na segunda tentativa
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-12 — Resumo mensal soma corretamente por categoria
- **Resultado esperado:** `totalGeral` e `totalPorCategoria` corretos, ignorando despesas de outros meses
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-13 — Resumo mensal sem informar o mês
- **Resultado esperado:** status 400
- **Status:** Passou (coberto por teste automatizado)

## Gaps encontrados

Esses são os bugs e gaps que fui encontrando ao longo do caminho (a maioria nas sessões exploratórias, alguns só de ler o código). Abri uma Issue pra cada um (label `bug`) e organizei no [board do projeto](https://github.com/users/maiayuri/projects/1). Não corrigi nenhum de propósito, já que o combinado era documentar e não mexer.

| Issue | Descrição |
|---|---|
| [#1](https://github.com/maiayuri/PPP-mentoria-2026-controle-de-gastos/issues/1) | Falta endpoint de edição (PUT) de despesa |
| [#2](https://github.com/maiayuri/PPP-mentoria-2026-controle-de-gastos/issues/2) | Cadastro de usuário não valida nem normaliza o email |
| [#3](https://github.com/maiayuri/PPP-mentoria-2026-controle-de-gastos/issues/3) | Campo `data` da despesa não valida formato de data |
| [#4](https://github.com/maiayuri/PPP-mentoria-2026-controle-de-gastos/issues/4) | Parâmetro `mes` não valida formato/intervalo |
| [#5](https://github.com/maiayuri/PPP-mentoria-2026-controle-de-gastos/issues/5) | JSON malformado retorna 500 em vez de 400 |
| [#6](https://github.com/maiayuri/PPP-mentoria-2026-controle-de-gastos/issues/6) | `JWT_SECRET` com valor padrão hardcoded no código-fonte |
| [#7](https://github.com/maiayuri/PPP-mentoria-2026-controle-de-gastos/issues/7) | Email tratado como case-sensitive, permite cadastro duplicado |
| [#8](https://github.com/maiayuri/PPP-mentoria-2026-controle-de-gastos/issues/8) | Erro de precisão de ponto flutuante no resumo mensal |
| [#9](https://github.com/maiayuri/PPP-mentoria-2026-controle-de-gastos/issues/9) | Campo `valor` sem limite máximo |
| [#10](https://github.com/maiayuri/PPP-mentoria-2026-controle-de-gastos/issues/10) | Payload grande retorna 500 em vez de 413 |
| [#11](https://github.com/maiayuri/PPP-mentoria-2026-controle-de-gastos/issues/11) | Login sem rate limiting / proteção contra força bruta |

Ver as sessões exploratórias completas em [`docs/exploratorios/`](exploratorios/) para os passos de reprodução de cada um.
