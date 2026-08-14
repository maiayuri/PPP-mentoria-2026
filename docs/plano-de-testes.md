# Plano de Testes — API de Controle de Gastos Pessoais

Antes de sair testando tudo de qualquer jeito, montei esse plano rápido pra guiar o que eu ia cobrir e como. Nada muito burocrático, só o essencial pra não esquecer nenhuma frente importante.

## Objetivo
Validar a API de controle de gastos pessoais — autenticação, regras de negócio, isolamento entre usuários e tratamento de erros — aplicando as técnicas de teste que vi ao longo da mentoria.

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
- Todo caso crítico (autenticação, isolamento entre usuários, validações de despesa) precisa estar coberto por pelo menos um teste, manual ou automatizado
- Bug encontrado vira Issue — não corrijo nada, só documento
- O CI precisa rodar a suíte automatizada a cada push

## Riscos identificados
- Como os dados ficam em memória, tudo se perde quando reinicio o servidor. Isso complica reproduzir um bug de uma sessão anterior se eu não anotar direito o payload usado — por isso fui cuidadoso em registrar isso nas evidências.
