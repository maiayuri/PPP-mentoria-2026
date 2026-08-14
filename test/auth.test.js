const request = require("supertest");
const app = require("../src/app");

describe("Autenticação", () => {
  it("deve registrar um novo usuário com sucesso", async () => {
    const res = await request(app).post("/auth/registro").send({
      nome: "Teste Um",
      email: "teste1@exemplo.com",
      senha: "123456",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("teste1@exemplo.com");
    expect(res.body).not.toHaveProperty("senhaHash");
  });

  it("não deve permitir registro com email já existente", async () => {
    await request(app).post("/auth/registro").send({
      nome: "Duplicado",
      email: "duplicado@exemplo.com",
      senha: "123456",
    });

    const res = await request(app).post("/auth/registro").send({
      nome: "Duplicado 2",
      email: "duplicado@exemplo.com",
      senha: "654321",
    });

    expect(res.status).toBe(409);
  });

  it("não deve registrar sem nome, email ou senha", async () => {
    const res = await request(app)
      .post("/auth/registro")
      .send({ email: "sem-nome@exemplo.com" });

    expect(res.status).toBe(400);
  });

  it("deve logar e retornar um token válido", async () => {
    await request(app).post("/auth/registro").send({
      nome: "Login Teste",
      email: "login@exemplo.com",
      senha: "123456",
    });

    const res = await request(app).post("/auth/login").send({
      email: "login@exemplo.com",
      senha: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  it("não deve logar com senha incorreta", async () => {
    await request(app).post("/auth/registro").send({
      nome: "Senha Errada",
      email: "senhaerrada@exemplo.com",
      senha: "123456",
    });

    const res = await request(app).post("/auth/login").send({
      email: "senhaerrada@exemplo.com",
      senha: "errada",
    });

    expect(res.status).toBe(401);
  });

  it("não deve logar com email inexistente", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "naoexiste@exemplo.com",
      senha: "123456",
    });

    expect(res.status).toBe(401);
  });
});
