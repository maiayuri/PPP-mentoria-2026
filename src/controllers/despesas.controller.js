const despesasService = require("../services/despesas.service");

function criar(req, res, next) {
  try {
    const despesa = despesasService.criar(req.usuarioId, req.body);
    res.status(201).json(despesa);
  } catch (err) {
    next(err);
  }
}

function listar(req, res, next) {
  try {
    const { categoria, mes } = req.query;
    const despesas = despesasService.listar(req.usuarioId, { categoria, mes });
    res.status(200).json(despesas);
  } catch (err) {
    next(err);
  }
}

function buscarPorId(req, res, next) {
  try {
    const despesa = despesasService.buscarPorId(req.usuarioId, req.params.id);
    res.status(200).json(despesa);
  } catch (err) {
    next(err);
  }
}

function remover(req, res, next) {
  try {
    despesasService.remover(req.usuarioId, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

function resumo(req, res, next) {
  try {
    const resultado = despesasService.resumoMensal(req.usuarioId, req.query.mes);
    res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

module.exports = { criar, listar, buscarPorId, remover, resumo };
