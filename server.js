require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { generatePaymentValidation, paymentCodeValidation } = require('./utils/validations');
const PaymentController = require('./controllers/paymentController');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5500', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(express.json());

// Middleware de log global
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    body: req.body,
    headers: req.headers
  });
  next();
});

// Rotas
app.get('/api/v1/payment/:paymentCode', 
  paymentCodeValidation,
  PaymentController.findPayment
);

app.post('/api/v1/payment', 
  generatePaymentValidation,
  PaymentController.createPayment
);

app.post('/api/v1/payment/refund/:paymentCode', 
  paymentCodeValidation,
  PaymentController.refundPayment
);

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  logger.error('Erro não tratado', err);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;