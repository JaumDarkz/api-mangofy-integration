const axios = require('axios');
const config = require('../config/mangofy');
const logger = require('../utils/logger');

class MangofyService {
  constructor() {
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': config.secretKey,
        'Store-Code': config.storeCode,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Configuração de interceptores para log e tratamento de erros
    this.client.interceptors.request.use(request => {
      logger.info('Requisição Mangofy', {
        method: request.method,
        url: request.url,
        data: request.data
      });
      return request;
    });

    this.client.interceptors.response.use(
      response => response,
      error => {
        logger.error('Erro na requisição Mangofy', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        throw error;
      }
    );
  }

  async findPayment(paymentCode) {
    try {
      const response = await this.client.get(`/api/v1/payment/${paymentCode}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw { status: 404, message: 'Pagamento não encontrado' };
      }
      throw { 
        status: error.response?.status || 500, 
        message: error.response?.data?.message || 'Erro ao buscar pagamento' 
      };
    }
  }

  async createPayment(paymentData) {
    try {
      // Remover campos nulos/undefined
      const cleanedPaymentData = Object.fromEntries(
        Object.entries(paymentData).filter(([_, v]) => v != null)
      );

      const response = await this.client.post('/api/v1/payment', {
        store_code: config.storeCode,
        ...cleanedPaymentData
      });
      return response.data;
    } catch (error) {
      throw { 
        status: error.response?.status || 500, 
        message: error.response?.data?.message || 'Erro ao criar pagamento',
        details: error.response?.data 
      };
    }
  }

  async refundPayment(paymentCode) {
    try {
      const response = await this.client.post(`/api/v1/payment/refund/${paymentCode}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw { status: 404, message: 'Pagamento não encontrado' };
      }
      if (error.response?.status === 409) {
        throw { status: 409, message: 'Cancelamento não permitido' };
      }
      throw { 
        status: error.response?.status || 500, 
        message: error.response?.data?.message || 'Erro ao estornar pagamento' 
      };
    }
  }
}

module.exports = new MangofyService();