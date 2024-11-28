require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "Store-Code", "Accept"],
};
app.use(cors(corsOptions));

const API_URL = "https://checkout.mangofy.com.br/api/v1/payment";
const API_KEY = process.env.API_KEY
const STORE_CODE = process.env.STORE_CODE

app.post('/api/payment/pix', async (req, res) => {
    const {
        name,
        document,
        email,
        phone,
        payment_amount,
        ip,
        city,
        state,
        street,
        street_number,
        neighborhood,
        zip_code,
        complement,
    } = req.body;

    const payload = {
        store_code: STORE_CODE,
        payment_method: "pix",
        payment_format: "regular",
        payment_amount,
        pix: {
            expires_in_days: 5,
        },
        customer: {
            name,
            document,
            email,
            phone,
            ip,
        },
        items: [
            {
                item_id: 1,
                quantity: 1,
                unit_price: payment_amount,
                description: "Compra via PIX",
            },
        ],
        shipping: {
            city,
            state,
            street,
            street_number,
            neighborhood,
            zip_code,
            complement,
            country: "Brasil",
        },
        installments: 1,
        postback_url: "https://checkouttest.free.beeceptor.com",
        external_code: `ext-${Date.now()}`,
        shipping_amount: 0,
        api_enum: 1,
    };

    try {
        const response = await axios.post(API_URL, payload, {
            headers: {
                Authorization: API_KEY,
                "Store-Code": STORE_CODE,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Erro na API:", error.response?.data || error.message);

        res.status(error.response?.status || 500).json({
            error: error.response?.data || "Erro desconhecido",
        });
    }
});

app.get('/', (req, res) => {
    res.send("Servidor está funcionando!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
