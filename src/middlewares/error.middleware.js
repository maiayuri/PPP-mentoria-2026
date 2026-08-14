const AppError = require("../errors/AppError");

function tratarErros(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ mensagem: err.message });
  }

  console.error(err);
  return res.status(500).json({ mensagem: "erro interno do servidor" });
}

module.exports = tratarErros;
