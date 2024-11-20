const { body, param } = require('express-validator');

exports.generatePaymentValidation = [
  body('payment_amount').isInt({ min: 500, max: 2000000 }).withMessage('Valor inválido'),
  body('payment_method').isIn(['credit_card', 'billet', 'pix']).withMessage('Método de pagamento inválido'),
  body('customer.email').optional().isEmail().withMessage('Email inválido'),
  body('customer.document').optional().isLength({ min: 11, max: 14 }).withMessage('Documento inválido')
];

exports.paymentCodeValidation = [
  param('paymentCode').isString().notEmpty().withMessage('Código de pagamento é obrigatório')
];