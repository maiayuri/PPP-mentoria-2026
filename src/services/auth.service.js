const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const usuarioModel = require("../models/usuario.model");
const AppError = require("../errors/AppError");

const JWT_SECRET = process.env.JWT_SECRET || "segredo-portfolio-mentoria";
const JWT_EXPIRES_IN = "8h";

function registrar({ nome, email, senha }) {
  if (!nome || !email || !senha) {
    throw new AppError("nome, email e senha são obrigatórios", 400);
  }

  if (usuarioModel.buscarPorEmail(email)) {
    throw new AppError("já existe um usuário cadastrado com esse email", 409);
  }

  const usuario = {
    id: randomUUID(),
    nome,
    email,
    senhaHash: bcrypt.hashSync(senha, 10),
  };

  usuarioModel.criar(usuario);

  return { id: usuario.id, nome: usuario.nome, email: usuario.email };
}

function login({ email, senha }) {
  if (!email || !senha) {
    throw new AppError("email e senha são obrigatórios", 400);
  }

  const usuario = usuarioModel.buscarPorEmail(email);
  if (!usuario || !bcrypt.compareSync(senha, usuario.senhaHash)) {
    throw new AppError("email ou senha inválidos", 401);
  }

  const token = jwt.sign({ sub: usuario.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { token };
}

module.exports = { registrar, login, JWT_SECRET };
