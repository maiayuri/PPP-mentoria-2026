const path = require("path");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require(path.join(__dirname, "..", "resources", "swagger.json"));
const authRoutes = require("./routes/auth.routes");
const despesasRoutes = require("./routes/despesas.routes");
const tratarErros = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auth", authRoutes);
app.use("/despesas", despesasRoutes);

app.use((req, res) => {
  res.status(404).json({ mensagem: "rota não encontrada" });
});

app.use(tratarErros);

module.exports = app;
