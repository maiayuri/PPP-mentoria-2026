const despesas = [];

function criar(despesa) {
  despesas.push(despesa);
  return despesa;
}

function listarPorUsuario(usuarioId) {
  return despesas.filter((d) => d.usuarioId === usuarioId);
}

function buscarPorId(id) {
  return despesas.find((d) => d.id === id);
}

function remover(id) {
  const index = despesas.findIndex((d) => d.id === id);
  if (index === -1) return false;
  despesas.splice(index, 1);
  return true;
}

module.exports = { despesas, criar, listarPorUsuario, buscarPorId, remover };
