const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../services/auth.service");
const AppError = require("../errors/AppError");

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("token de autenticação não informado", 401));
  }

  const token = authHeader.substring("Bearer ".length);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuarioId = payload.sub;
    next();
  } catch (err) {
    next(new AppError("token de autenticação inválido ou expirado", 401));
  }
}

module.exports = autenticar;
