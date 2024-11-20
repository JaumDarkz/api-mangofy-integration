require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');  // Importando o CORS
const { generatePaymentValidation, paymentCodeValidation } = require('./utils/validations');
const PaymentController = require('./controllers/paymentController');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Substitua com a origem do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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
