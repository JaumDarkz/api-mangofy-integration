const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
const paymentRoutes = require("./routes/payment");
app.use("/api/payments", paymentRoutes);

module.exports = app;
