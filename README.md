# API de Controle de Gastos Pessoais

![CI](https://github.com/maiayuri/PPP-mentoria-2026/actions/workflows/ci.yml/badge.svg)

Esse é o meu projeto de portfólio da mentoria de testes de software. A ideia era simples: uma API pra controlar meus próprios gastos, com cadastro de despesas e um resumo mensal por categoria — nada muito elaborado, porque o objetivo aqui não é a aplicação em si.

Segui a orientação da mentoria e usei o GitHub Copilot só pra gerar o esqueleto da aplicação a partir do prompt que está em [prompts.md](./prompts.md) (isso poupou bastante tempo). Daí em diante, todo o trabalho de teste — plano, casos de teste, sessões exploratórias, automação, performance e os bugs que encontrei — foi feito por mim.

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

O grosso do trabalho está documentado em `docs/`:

- [`docs/plano-de-testes.md`](docs/plano-de-testes.md) — escopo e estratégia
- [`docs/casos-de-teste.md`](docs/casos-de-teste.md) — casos de teste manuais e automatizados
- [`docs/exploratorios/`](docs/exploratorios/) — minhas sessões de teste exploratório (charters e anotações)
- [`docs/evidencias/`](docs/evidencias/) — evidências de execução da API
- [`resources/postman-collection.json`](resources/postman-collection.json) — collection que usei pros testes manuais

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
prompts.md        -> prompt que usei pra gerar o esqueleto do projeto
```

## Fluxo básico de uso

1. `POST /auth/registro` com `nome`, `email` e `senha`
2. `POST /auth/login` com `email` e `senha` para obter o token JWT
3. Usar o token no header `Authorization: Bearer <token>` para acessar os endpoints de `/despesas`
4. `POST /despesas` para cadastrar uma despesa
5. `GET /despesas` para listar (com filtros `categoria` e `mes`), `GET /despesas/resumo?mes=YYYY-MM` para o resumo mensal

## Bugs conhecidos

Ao longo das sessões exploratórias (e revisando o código gerado) encontrei 11 bugs/gaps reais. Não corrigi nenhum de propósito — documentei tudo como Issue e organizei no [board do projeto](https://github.com/users/maiayuri/projects/1), que é justamente o que a mentoria pediu: mostrar que consigo achar e reportar problema, não necessariamente resolver tudo.

[Ver as issues de bug](https://github.com/maiayuri/PPP-mentoria-2026/issues?q=is%3Aissue+label%3Abug)

Os passos de reprodução de cada um estão em [`docs/casos-de-teste.md`](docs/casos-de-teste.md#gaps-encontrados).
