const { Router } = require("express");
const despesasController = require("../controllers/despesas.controller");
const autenticar = require("../middlewares/auth.middleware");

const router = Router();

router.use(autenticar);

router.post("/", despesasController.criar);
router.get("/resumo", despesasController.resumo);
router.get("/", despesasController.listar);
router.get("/:id", despesasController.buscarPorId);
router.delete("/:id", despesasController.remover);

module.exports = router;
