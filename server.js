require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Configurações padrão para requisições à API Mangofy
const mangofyConfig = {
    baseURL: 'https://checkout.mangofy.com.br', // URL base correta
    headers: {
        'Authorization': process.env.MANGOFY_SECRET_KEY,
        'Store-Code': process.env.MANGOFY_STORE_CODE,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Criar instância do Axios para facilitar interceptação
const mangofyApi = axios.create(mangofyConfig);

// Buscar pagamento
app.get('/payment/:paymentCode', async (req, res) => {
    try {
        const { paymentCode } = req.params;
        const response = await mangofyApi.get(`/api/v1/payment/${paymentCode}`);
        res.json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        res.status(status).json(error.response?.data || { message: 'Erro interno' });
    }
});

// Gerar pagamento
app.post('/payment', async (req, res) => {
    try {
        const paymentData = {
            store_code: process.env.MANGOFY_STORE_CODE,
            ...req.body
        };

        // Validações básicas
        if (!paymentData.payment_method) {
            return res.status(400).json({ message: "Método de pagamento é obrigatório" });
        }
        if (!paymentData.payment_amount || paymentData.payment_amount < 500) {
            return res.status(400).json({ message: "Valor inválido" });
        }

        // Campos obrigatórios por método
        switch(paymentData.payment_method) {
            case 'credit_card':
                if (!paymentData.card) {
                    return res.status(400).json({ message: "Dados do cartão são obrigatórios" });
                }
                break;
            case 'pix':
                if (!paymentData.pix) {
                    return res.status(400).json({ message: "Dados do PIX são obrigatórios" });
                }
                break;
            case 'billet':
                if (!paymentData.billet) {
                    return res.status(400).json({ message: "Dados do boleto são obrigatórios" });
                }
                break;
        }

        const response = await mangofyApi.post('/api/v1/payment', paymentData);
        
        res.json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        res.status(status).json(error.response?.data || { message: 'Erro interno' });
    }
});

// Estornar pagamento
app.post('/payment/refund/:paymentCode', async (req, res) => {
    try {
        const { paymentCode } = req.params;
        const response = await mangofyApi.post(`/api/v1/payment/refund/${paymentCode}`);
        
        res.json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        res.status(status).json(error.response?.data || { message: 'Erro interno' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});