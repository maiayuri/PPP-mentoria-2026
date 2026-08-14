const request = require("supertest");
const app = require("../src/app");

async function criarUsuarioAutenticado(email) {
  await request(app).post("/auth/registro").send({
    nome: "Usuario Teste",
    email,
    senha: "123456",
  });

  const login = await request(app)
    .post("/auth/login")
    .send({ email, senha: "123456" });

  return login.body.token;
}

describe("Despesas", () => {
  it("deve criar uma despesa válida", async () => {
    const token = await criarUsuarioAutenticado("despesa1@exemplo.com");

    const res = await request(app)
      .post("/despesas")
      .set("Authorization", `Bearer ${token}`)
      .send({ valor: 50, categoria: "transporte", data: "2026-08-10", descricao: "Uber" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.valor).toBe(50);
  });

  it("não deve criar despesa sem token de autenticação", async () => {
    const res = await request(app)
      .post("/despesas")
      .send({ valor: 50, categoria: "transporte", data: "2026-08-10" });

    expect(res.status).toBe(401);
  });

  it("não deve criar despesa com valor negativo", async () => {
    const token = await criarUsuarioAutenticado("despesa2@exemplo.com");

    const res = await request(app)
      .post("/despesas")
      .set("Authorization", `Bearer ${token}`)
      .send({ valor: -10, categoria: "transporte", data: "2026-08-10" });

    expect(res.status).toBe(400);
  });

  it("não deve criar despesa com categoria inválida", async () => {
    const token = await criarUsuarioAutenticado("despesa3@exemplo.com");

    const res = await request(app)
      .post("/despesas")
      .set("Authorization", `Bearer ${token}`)
      .send({ valor: 10, categoria: "categoria-invalida", data: "2026-08-10" });

    expect(res.status).toBe(400);
  });

  it("deve listar apenas as despesas do usuário autenticado", async () => {
    const tokenA = await criarUsuarioAutenticado("usuarioA@exemplo.com");
    const tokenB = await criarUsuarioAutenticado("usuarioB@exemplo.com");

    await request(app)
      .post("/despesas")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ valor: 20, categoria: "lazer", data: "2026-08-01" });

    const resA = await request(app).get("/despesas").set("Authorization", `Bearer ${tokenA}`);
    const resB = await request(app).get("/despesas").set("Authorization", `Bearer ${tokenB}`);

    expect(resA.body.length).toBe(1);
    expect(resB.body.length).toBe(0);
  });

  it("não deve permitir que um usuário acesse a despesa de outro usuário", async () => {
    const tokenA = await criarUsuarioAutenticado("isolamentoA@exemplo.com");
    const tokenB = await criarUsuarioAutenticado("isolamentoB@exemplo.com");

    const criada = await request(app)
      .post("/despesas")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ valor: 30, categoria: "saude", data: "2026-08-05" });

    const res = await request(app)
      .get(`/despesas/${criada.body.id}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(403);
  });

  it("deve retornar 404 ao buscar despesa inexistente", async () => {
    const token = await criarUsuarioAutenticado("despesa404@exemplo.com");

    const res = await request(app)
      .get("/despesas/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("deve excluir uma despesa existente", async () => {
    const token = await criarUsuarioAutenticado("despesa-excluir@exemplo.com");

    const criada = await request(app)
      .post("/despesas")
      .set("Authorization", `Bearer ${token}`)
      .send({ valor: 15, categoria: "outros", data: "2026-08-02" });

    const resDelete = await request(app)
      .delete(`/despesas/${criada.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(resDelete.status).toBe(204);

    const resGet = await request(app)
      .get(`/despesas/${criada.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(resGet.status).toBe(404);
  });

  it("deve calcular o resumo mensal por categoria corretamente", async () => {
    const token = await criarUsuarioAutenticado("resumo@exemplo.com");

    await request(app)
      .post("/despesas")
      .set("Authorization", `Bearer ${token}`)
      .send({ valor: 100, categoria: "alimentacao", data: "2026-08-01" });

    await request(app)
      .post("/despesas")
      .set("Authorization", `Bearer ${token}`)
      .send({ valor: 50, categoria: "alimentacao", data: "2026-08-15" });

    await request(app)
      .post("/despesas")
      .set("Authorization", `Bearer ${token}`)
      .send({ valor: 30, categoria: "transporte", data: "2026-07-20" });

    const res = await request(app)
      .get("/despesas/resumo?mes=2026-08")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalGeral).toBe(150);
    expect(res.body.totalPorCategoria.alimentacao).toBe(150);
    expect(res.body.totalPorCategoria.transporte).toBeUndefined();
  });

  it("deve retornar 400 no resumo sem o parâmetro mes", async () => {
    const token = await criarUsuarioAutenticado("resumo-sem-mes@exemplo.com");

    const res = await request(app)
      .get("/despesas/resumo")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});
