const fs = require("fs");
const path = require("path");
const autocannon = require("autocannon");
const app = require("../src/app");

async function obterToken(port) {
  const email = `performance-${Date.now()}@exemplo.com`;

  await fetch(`http://localhost:${port}/auth/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Performance", email, senha: "123456" }),
  });

  const loginRes = await fetch(`http://localhost:${port}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha: "123456" }),
  });

  const { token } = await loginRes.json();
  return token;
}

async function main() {
  const server = app.listen(0);
  const { port } = server.address();

  const token = await obterToken(port);

  await fetch(`http://localhost:${port}/despesas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ valor: 42, categoria: "outros", data: "2026-08-01" }),
  });

  console.log(`Rodando teste de performance contra http://localhost:${port}/despesas ...`);

  const resultado = await autocannon({
    url: `http://localhost:${port}/despesas`,
    connections: 20,
    duration: 10,
    headers: { Authorization: `Bearer ${token}` },
  });

  const resumo = autocannon.printResult(resultado);
  console.log(resumo);

  const docsDir = path.join(__dirname, "..", "docs");
  fs.mkdirSync(docsDir, { recursive: true });

  const relatorio = [
    "# Resultado do teste de performance",
    "",
    `Data da execução: ${new Date().toISOString()}`,
    "Endpoint: GET /despesas",
    "Conexões simultâneas: 20",
    "Duração: 10s",
    "",
    "```",
    resumo,
    "```",
    "",
    `Requisições/seg (média): ${resultado.requests.average}`,
    `Latência média: ${resultado.latency.average}ms`,
    `Erros: ${resultado.errors}`,
    `Timeouts: ${resultado.timeouts}`,
  ].join("\n");

  fs.writeFileSync(path.join(docsDir, "performance-resultado.md"), relatorio);
  console.log("Relatório salvo em docs/performance-resultado.md");

  server.close();
}

main();
