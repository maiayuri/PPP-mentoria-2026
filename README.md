# API de Controle de Gastos Pessoais

Projeto de portfólio pessoal da mentoria, criado com auxílio de IA generativa a partir do prompt em [prompts.md](./prompts.md).

API REST para cadastro de usuários e controle de despesas pessoais, com resumo mensal de gastos por categoria.

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
- Dados armazenados em memória (sem banco de dados real)
- Documentação da API via Swagger (OpenAPI 3.0)

## Como rodar

Pré-requisito: Node.js instalado (versão 18+).

```bash
npm install
npm run dev
```

A API sobe em `http://localhost:3000`.

Documentação interativa (Swagger UI): `http://localhost:3000/docs`

## Estrutura do projeto

```
src/
  routes/       -> definição das rotas HTTP
  controllers/  -> recebe a requisição e chama o service
  services/     -> regras de negócio e validações
  models/       -> armazenamento em memória dos dados
  middlewares/  -> autenticação JWT e tratamento de erros
  errors/       -> classe de erro customizada (AppError)
resources/
  swagger.json  -> especificação OpenAPI da API
prompts.md      -> prompt usado para gerar o projeto
```

## Fluxo básico de uso

1. `POST /auth/registro` com `nome`, `email` e `senha`
2. `POST /auth/login` com `email` e `senha` para obter o token JWT
3. Usar o token no header `Authorization: Bearer <token>` para acessar os endpoints de `/despesas`
4. `POST /despesas` para cadastrar uma despesa
5. `GET /despesas` para listar, `GET /despesas/resumo?mes=YYYY-MM` para o resumo mensal
