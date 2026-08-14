# API de Controle de Gastos Pessoais

![CI](https://github.com/maiayuri/PPP-mentoria-2026-controle-de-gastos/actions/workflows/ci.yml/badge.svg)

Projeto de portfólio da mentoria de testes de software: uma API simples de controle de gastos pessoais, com cadastro de despesas e resumo mensal por categoria. O escopo foi mantido propositalmente enxuto, já que o foco do projeto está nas atividades de teste realizadas em cima da aplicação, não na aplicação em si.

Conforme orientado na mentoria, usei uma IA generativa (Claude) para gerar o esqueleto inicial da aplicação a partir do prompt documentado em [prompts.md](./prompts.md). A partir daí, todo o trabalho de teste — plano, casos de teste, sessões exploratórias, automação, testes de performance e os bugs documentados — foi conduzido por mim.

## Índice

- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Como rodar](#como-rodar)
- [Testes](#testes)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Fluxo básico de uso](#fluxo-básico-de-uso)
- [Bugs conhecidos](#bugs-conhecidos)

## Funcionalidades

- Registro e login de usuário (autenticação via JWT)
- Cadastro de despesa (valor, categoria, data, descrição)
- Listagem de despesas do usuário logado, com filtro por categoria e/ou mês
- Consulta de despesa por id
- Exclusão de despesa
- Resumo mensal com total geral e total por categoria

Categorias válidas: `alimentacao`, `transporte`, `moradia`, `saude`, `lazer`, `educacao`, `outros`.

Cada usuário só tem acesso às próprias despesas.

## Stack

- Node.js + Express
- Autenticação via JWT (middleware)
- Dados armazenados em memória (sem banco de dados real, por decisão de escopo)
- Documentação da API via Swagger (OpenAPI 3.0)
- Jest + Supertest para testes automatizados, autocannon para performance
- GitHub Actions para integração contínua

## Como rodar

Pré-requisito: Node.js instalado (versão 18+).

```bash
npm install
npm run dev
```

A API sobe em `http://localhost:3000`.

Documentação interativa (Swagger UI): `http://localhost:3000/docs`

## Testes

| Comando | O que faz |
|---|---|
| `npm test` | Roda a suíte automatizada (Jest + Supertest) — 19 testes cobrindo autenticação, CRUD de despesas, isolamento entre usuários e validações |
| `npm run test:coverage` | Roda a suíte com relatório de cobertura de código |
| `npm run test:performance` | Roda um teste de carga (autocannon) contra `GET /despesas` e salva o resultado em `docs/performance-resultado.md` |

A documentação de teste está organizada em `docs/`:

- [`docs/plano-de-testes.md`](docs/plano-de-testes.md) — escopo e estratégia
- [`docs/casos-de-teste.md`](docs/casos-de-teste.md) — casos de teste manuais e automatizados
- [`docs/exploratorios/`](docs/exploratorios/) — sessões de teste exploratório (charters e anotações)
- [`docs/evidencias/`](docs/evidencias/) — evidências de execução da API
- [`resources/postman-collection.json`](resources/postman-collection.json) — collection para testes manuais

## Estrutura do projeto

```
src/
  routes/         -> definição das rotas HTTP
  controllers/    -> recebe a requisição e chama o service
  services/       -> regras de negócio e validações
  models/         -> armazenamento em memória dos dados
  middlewares/    -> autenticação JWT e tratamento de erros
  errors/         -> classe de erro customizada (AppError)
test/             -> testes automatizados (Jest + Supertest)
performance/      -> teste de carga (autocannon)
docs/             -> plano de testes, casos de teste, sessões exploratórias, evidências
resources/
  swagger.json           -> especificação OpenAPI da API
  postman-collection.json -> collection para testes manuais
.github/workflows/ci.yml -> pipeline de integração contínua
prompts.md        -> prompt usado para gerar o esqueleto do projeto
```

## Fluxo básico de uso

1. `POST /auth/registro` com `nome`, `email` e `senha`
2. `POST /auth/login` com `email` e `senha` para obter o token JWT
3. Usar o token no header `Authorization: Bearer <token>` para acessar os endpoints de `/despesas`
4. `POST /despesas` para cadastrar uma despesa
5. `GET /despesas` para listar (com filtros `categoria` e `mes`), `GET /despesas/resumo?mes=YYYY-MM` para o resumo mensal

## Bugs conhecidos

Ao longo das sessões exploratórias e da revisão de código, foram identificados 11 bugs/gaps reais. Nenhum foi corrigido intencionalmente — cada um foi documentado como Issue e organizado no [board do projeto](https://github.com/users/maiayuri/projects/1), já que o objetivo dessa etapa é demonstrar a capacidade de encontrar e reportar problemas, não necessariamente resolvê-los.

[Ver as issues de bug](https://github.com/maiayuri/PPP-mentoria-2026-controle-de-gastos/issues?q=is%3Aissue+label%3Abug)

Os passos de reprodução de cada um estão em [`docs/casos-de-teste.md`](docs/casos-de-teste.md#gaps-encontrados).
