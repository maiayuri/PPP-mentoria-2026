# Evidências de execução da API

Evidências reais, capturadas executando a aplicação localmente (`npm run dev`) e fazendo requisições HTTP reais com `curl`. Complementam os casos de teste em [`docs/casos-de-teste.md`](../casos-de-teste.md). Para testes manuais interativos, também está disponível a collection do Postman em [`resources/postman-collection.json`](../../resources/postman-collection.json).

**Data da execução:** 2026-08-14

## 1. Registro de usuário — `POST /auth/registro`

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":"1047e9e2-f582-4167-bdf0-9f9db248c416","nome":"Yuri Maia","email":"yuri.evidencia@exemplo.com"}
```

## 2. Login — `POST /auth/login`

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDQ3ZTllMi1mNTgyLTQxNjctYmRmMC05ZjlkYjI0OGM0MTYiLCJpYXQiOjE3ODY3MzQ5NzUsImV4cCI6MTc4Njc2Mzc3NX0.zZPKJnpCMGJoV0k2LtgKT3vLp-YVX7ffDPRFz5j4r9E"}
```

## 3. Criar despesa — `POST /despesas`

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":"df56c305-c8c1-41aa-9d0d-fe16d41b3c1b","usuarioId":"1047e9e2-f582-4167-bdf0-9f9db248c416","valor":89.9,"categoria":"alimentacao","data":"2026-08-14","descricao":"Almoco com a equipe"}
```

## 4. Consultar despesa por id — `GET /despesas/:id`

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"id":"df56c305-c8c1-41aa-9d0d-fe16d41b3c1b","usuarioId":"1047e9e2-f582-4167-bdf0-9f9db248c416","valor":89.9,"categoria":"alimentacao","data":"2026-08-14","descricao":"Almoco com a equipe"}
```

## 5. Resumo mensal — `GET /despesas/resumo?mes=2026-08`

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"mes":"2026-08","totalGeral":89.9,"totalPorCategoria":{"alimentacao":89.9}}
```

## 6. Requisição sem token de autenticação — `GET /despesas`

```
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{"mensagem":"token de autenticação não informado"}
```

## Referências cruzadas
- Bugs encontrados durante exploração: [`docs/exploratorios/`](../exploratorios/) e [Issues do repositório](https://github.com/maiayuri/PPP-mentoria-2026/issues)
- Resultado do teste de performance: [`docs/performance-resultado.md`](../performance-resultado.md)
- Suíte automatizada: `npm test` (19 testes) e `npm run test:coverage` (relatório de cobertura)
