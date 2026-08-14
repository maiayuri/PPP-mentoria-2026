const { v4: uuidv4 } = require("uuid");
const despesaModel = require("../models/despesa.model");
const AppError = require("../errors/AppError");
const { CATEGORIAS_VALIDAS } = require("../utils/categorias");

function criar(usuarioId, { valor, categoria, data, descricao }) {
  if (valor === undefined || categoria === undefined || !data) {
    throw new AppError("valor, categoria e data são obrigatórios", 400);
  }

  if (typeof valor !== "number" || valor <= 0) {
    throw new AppError("valor deve ser um número maior que zero", 400);
  }

  if (!CATEGORIAS_VALIDAS.includes(categoria)) {
    throw new AppError(
      `categoria inválida. Use uma das: ${CATEGORIAS_VALIDAS.join(", ")}`,
      400
    );
  }

  const despesa = {
    id: uuidv4(),
    usuarioId,
    valor,
    categoria,
    data,
    descricao: descricao || "",
  };

  despesaModel.criar(despesa);
  return despesa;
}

function listar(usuarioId, { categoria, mes }) {
  let despesas = despesaModel.listarPorUsuario(usuarioId);

  if (categoria) {
    despesas = despesas.filter((d) => d.categoria === categoria);
  }

  if (mes) {
    despesas = despesas.filter((d) => d.data.startsWith(mes));
  }

  return despesas;
}

function buscarPorId(usuarioId, id) {
  const despesa = despesaModel.buscarPorId(id);

  if (!despesa) {
    throw new AppError("despesa não encontrada", 404);
  }

  if (despesa.usuarioId !== usuarioId) {
    throw new AppError("você não tem permissão para acessar essa despesa", 403);
  }

  return despesa;
}

function remover(usuarioId, id) {
  const despesa = buscarPorId(usuarioId, id);
  despesaModel.remover(despesa.id);
}

function resumoMensal(usuarioId, mes) {
  if (!mes) {
    throw new AppError("o parâmetro mes é obrigatório (formato YYYY-MM)", 400);
  }

  const despesas = despesaModel
    .listarPorUsuario(usuarioId)
    .filter((d) => d.data.startsWith(mes));

  const totalPorCategoria = {};
  let totalGeral = 0;

  for (const despesa of despesas) {
    totalPorCategoria[despesa.categoria] =
      (totalPorCategoria[despesa.categoria] || 0) + despesa.valor;
    totalGeral += despesa.valor;
  }

  return { mes, totalGeral, totalPorCategoria };
}

module.exports = { criar, listar, buscarPorId, remover, resumoMensal };
