require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const { generatePaymentValidation, paymentCodeValidation } = require('./utils/validations');
const PaymentController = require('./controllers/paymentController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());

// Rota para buscar pagamento
app.get('/api/v1/payment/:paymentCode', 
  paymentCodeValidation,
  PaymentController.findPayment
);

// Rota para gerar pagamento
app.post('/api/v1/payment', 
  generatePaymentValidation,
  PaymentController.createPayment
);

// Rota para estornar pagamento
app.post('/api/v1/payment/refund/:paymentCode', 
  paymentCodeValidation,
  PaymentController.refundPayment
);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});