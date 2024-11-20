const { validationResult } = require('express-validator');
const MangofyService = require('../services/mangofyService');
const logger = require('../utils/logger');

class PaymentController {
  async findPayment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Erro de validação',
          errors: errors.array() 
        });
      }

      const { paymentCode } = req.params;
      const payment = await MangofyService.findPayment(paymentCode);
      
      res.json(payment);
    } catch (error) {
      logger.error('Erro ao buscar pagamento', error);
      res.status(error.status || 500).json({
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  async createPayment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Erro de validação',
          errors: errors.array() 
        });
      }

      const paymentData = req.body;
      const payment = await MangofyService.createPayment(paymentData);
      
      res.status(201).json(payment);
    } catch (error) {
      logger.error('Erro ao criar pagamento', error);
      res.status(error.status || 500).json({
        message: error.message || 'Erro interno do servidor',
        details: error.details
      });
    }
  }

  async refundPayment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Erro de validação',
          errors: errors.array() 
        });
      }

      const { paymentCode } = req.params;
      const refund = await MangofyService.refundPayment(paymentCode);
      
      res.json(refund);
    } catch (error) {
      logger.error('Erro ao estornar pagamento', error);
      res.status(error.status || 500).json({
        message: error.message || 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new PaymentController();