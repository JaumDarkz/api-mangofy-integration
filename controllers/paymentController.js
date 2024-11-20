const { validationResult } = require('express-validator');
const MangofyService = require('../services/mangofyService');

exports.findPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentCode } = req.params;
    const payment = await MangofyService.findPayment(paymentCode);
    
    res.json(payment);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
};

exports.createPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const paymentData = req.body;
    const payment = await MangofyService.createPayment(paymentData);
    
    res.status(201).json(payment);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
};

exports.refundPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentCode } = req.params;
    const refund = await MangofyService.refundPayment(paymentCode);
    
    res.json(refund);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
};