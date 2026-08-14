# Casos de Teste — API de Controle de Gastos Pessoais

Convenção: `CT-<área>-<número>`. Status possíveis: Passou, Falhou, Bloqueado.

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
- **Status:** Passou (validado manualmente via Swagger)

### CT-DESP-05 — Criar despesa com categoria inválida
- **Resultado esperado:** status 400
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-06 — Listar despesas retorna apenas as do usuário autenticado
- **Resultado esperado:** despesas de outro usuário não aparecem na listagem
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-07 — Filtrar despesas por categoria
- **Passos:** criar despesas em categorias diferentes; `GET /despesas?categoria=lazer`
- **Resultado esperado:** apenas despesas da categoria informada são retornadas
- **Status:** Passou (validado manualmente via Swagger)

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
- **Status:** Passou (validado manualmente via Swagger)

### CT-DESP-12 — Resumo mensal soma corretamente por categoria
- **Resultado esperado:** `totalGeral` e `totalPorCategoria` corretos, ignorando despesas de outros meses
- **Status:** Passou (coberto por teste automatizado)

### CT-DESP-13 — Resumo mensal sem informar o mês
- **Resultado esperado:** status 400
- **Status:** Passou (coberto por teste automatizado)

## Gaps encontrados (ver Issues no repositório)
- Não existe endpoint para **editar** uma despesa, embora o contexto original da aplicação previsse essa permissão (ver Issue de bug correspondente)
- Cadastro de usuário não valida formato de email
- `JWT_SECRET` possui valor padrão fixo no código-fonte, usado caso a variável de ambiente não seja definida
