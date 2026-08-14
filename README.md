# API de Controle de Gastos Pessoais

![CI](https://github.com/maiayuri/PPP-mentoria-2026/actions/workflows/ci.yml/badge.svg)

Projeto de portfólio pessoal da mentoria de testes de software. A aplicação foi criada com auxílio de IA generativa (GitHub Copilot) a partir do prompt em [prompts.md](./prompts.md); o foco do projeto está nas atividades de teste e qualidade de software realizadas em cima dela.

API REST para cadastro de usuários e controle de despesas pessoais, com resumo mensal de gastos por categoria.

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

Documentação de teste completa:

- [`docs/plano-de-testes.md`](docs/plano-de-testes.md) — escopo e estratégia
- [`docs/casos-de-teste.md`](docs/casos-de-teste.md) — casos de teste manuais e automatizados
- [`docs/exploratorios/`](docs/exploratorios/) — sessões de teste exploratório (charters e notas)
- [`docs/evidencias/`](docs/evidencias/) — evidências reais de execução da API
- [`resources/postman-collection.json`](resources/postman-collection.json) — collection para testes manuais no Postman/Insomnia

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
prompts.md        -> prompt usado para gerar o projeto com IA
```

## Fluxo básico de uso

1. `POST /auth/registro` com `nome`, `email` e `senha`
2. `POST /auth/login` com `email` e `senha` para obter o token JWT
3. Usar o token no header `Authorization: Bearer <token>` para acessar os endpoints de `/despesas`
4. `POST /despesas` para cadastrar uma despesa
5. `GET /despesas` para listar (com filtros `categoria` e `mes`), `GET /despesas/resumo?mes=YYYY-MM` para o resumo mensal

## Bugs conhecidos

Durante as sessões de teste exploratório e revisão de código, foram encontrados 11 bugs/gaps reais, documentados como Issues (sem correção, propositalmente — o objetivo do portfólio é demonstrar a capacidade de encontrar e documentar problemas) e organizados no [Project board](https://github.com/users/maiayuri/projects/1):

[Ver todas as issues de bug](https://github.com/maiayuri/PPP-mentoria-2026/issues?q=is%3Aissue+label%3Abug)

Lista completa com detalhes de reprodução em [`docs/casos-de-teste.md`](docs/casos-de-teste.md#gaps-encontrados).
