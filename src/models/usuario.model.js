const usuarios = [];

function criar(usuario) {
  usuarios.push(usuario);
  return usuario;
}

function buscarPorEmail(email) {
  return usuarios.find((u) => u.email === email);
}

function buscarPorId(id) {
  return usuarios.find((u) => u.id === id);
}

module.exports = { usuarios, criar, buscarPorEmail, buscarPorId };
