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
  }

  async findPayment(paymentCode) {
    try {
      const response = await this.client.get(`/api/v1/payment/${paymentCode}`);
      return response.data;
    } catch (error) {
      logger.error('Erro ao buscar pagamento', error);
      throw error.response?.data || { message: 'Erro ao buscar pagamento' };
    }
  }

  async createPayment(paymentData) {
    try {
      const response = await this.client.post('/api/v1/payment', {
        store_code: config.storeCode,
        ...paymentData
      });
      return response.data;
    } catch (error) {
      logger.error('Erro ao criar pagamento', error);
      throw error.response?.data || { message: 'Erro ao criar pagamento' };
    }
  }

  async refundPayment(paymentCode) {
    try {
      const response = await this.client.post(`/api/v1/payment/refund/${paymentCode}`);
      return response.data;
    } catch (error) {
      logger.error('Erro ao estornar pagamento', error);
      throw error.response?.data || { message: 'Erro ao estornar pagamento' };
    }
  }
}

module.exports = new MangofyService();
