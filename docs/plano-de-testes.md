# Plano de Testes — API de Controle de Gastos Pessoais

## Objetivo
Validar as funcionalidades da API de controle de gastos pessoais, cobrindo autenticação, regras de negócio, isolamento entre usuários e tratamento de erros, aplicando as técnicas de teste vistas na mentoria.

## Escopo

### Dentro do escopo
- Autenticação: registro e login (JWT)
- CRUD de despesas: criação, listagem, consulta por id, exclusão
- Resumo mensal de gastos por categoria
- Regras de autorização (isolamento entre usuários)
- Validações de entrada (valor, categoria, campos obrigatórios)
- Testes de performance no endpoint de listagem de despesas

### Fora do escopo
- Interface gráfica (a aplicação é apenas API, sem front-end)
- Persistência real em banco de dados (o armazenamento é em memória, por decisão de escopo do projeto)
- Testes de segurança aprofundados (pentest), além de checagens básicas identificadas na exploração

## Ambiente de testes
- Aplicação rodando localmente (`npm run dev`), porta 3000
- Banco de dados em memória (reiniciado a cada execução do servidor)
- Ferramentas: Postman/Insomnia (manual), Jest + Supertest (automação), autocannon (performance)

## Tipos de teste aplicados

| Tipo | Ferramenta/Técnica | Onde está documentado |
|---|---|---|
| Casos de teste manuais | Execução manual via Swagger/Postman | `docs/casos-de-teste.md` |
| Testes exploratórios | Sessões com charter, heurística SFDPOT | `docs/exploratorios/` |
| Testes automatizados de API | Jest + Supertest | `test/` |
| Testes de performance | autocannon | `performance/` e `docs/performance-resultado.md` |
| Integração contínua | GitHub Actions | `.github/workflows/ci.yml` |

## Critérios de aceite
- Todos os casos de teste críticos (autenticação, isolamento entre usuários, validações de despesa) devem estar cobertos por pelo menos um teste manual ou automatizado
- Bugs encontrados devem ser documentados como Issues no repositório, sem correção
- O pipeline de CI deve executar a suíte automatizada a cada push

## Riscos identificados
- Dados em memória são perdidos a cada reinício do servidor, o que pode dificultar a reprodução de bugs relatados em sessões anteriores (mitigado documentando o payload usado em cada evidência)
