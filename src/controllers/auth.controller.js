const authService = require("../services/auth.service");

function registrar(req, res, next) {
  try {
    const usuario = authService.registrar(req.body);
    res.status(201).json(usuario);
  } catch (err) {
    next(err);
  }
}

function login(req, res, next) {
  try {
    const resultado = authService.login(req.body);
    res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

module.exports = { registrar, login };
