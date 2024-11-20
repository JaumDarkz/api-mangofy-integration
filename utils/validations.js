const { body, param } = require('express-validator');

const validateOptionalString = (field, maxLength) => {
  return body(field)
    .optional()
    .isString()
    .isLength({ max: maxLength })
    .withMessage(`${field} deve ser uma string com no máximo ${maxLength} caracteres`);
};

exports.generatePaymentValidation = [
  body('store_code')
    .isString()
    .isLength({ max: 100 })
    .withMessage('Código da loja inválido'),
  
  body('external_code')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Código externo inválido'),
  
  body('payment_method')
    .isIn(['credit_card', 'billet', 'pix'])
    .withMessage('Método de pagamento inválido'),
  
  body('payment_format')
    .optional()
    .isIn(['regular', 'orderbump', 'upsell'])
    .withMessage('Formato de pagamento inválido'),
  
  body('installments')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Número de parcelas deve ser entre 1 e 12'),
  
  body('payment_amount')
    .isInt({ min: 500, max: 2000000 })
    .withMessage('Valor do pagamento deve estar entre 500 e 2.000.000 centavos'),
  
  body('shipping_amount')
    .optional()
    .isInt({ min: 0, max: 2000000 })
    .withMessage('Valor do frete inválido'),
  
  body('postback_url')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('URL de postback inválida'),
  
  body('customer.email')
    .optional()
    .isEmail()
    .isLength({ max: 254 })
    .withMessage('Email inválido'),
  
  body('customer.name')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Nome inválido'),
  
  body('customer.document')
    .optional()
    .isString()
    .isLength({ min: 11, max: 14 })
    .withMessage('Documento deve ter entre 11 e 14 caracteres'),
  
  body('customer.phone')
    .optional()
    .isString()
    .isLength({ max: 20 })
    .withMessage('Telefone inválido'),
  
  body('customer.ip')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('IP inválido'),
  
  body('card')
    .optional()
    .custom((card, { req }) => {
      if (req.body.payment_method === 'credit_card') {
        if (!card) {
          throw new Error('Dados do cartão são obrigatórios para pagamento com cartão');
        }
        
        if (card.number && card.number.length > 20) {
          throw new Error('Número do cartão deve ter no máximo 20 caracteres');
        }
        
        if (card.holder_name && card.holder_name.length > 100) {
          throw new Error('Nome do titular deve ter no máximo 100 caracteres');
        }
        
        if (card.expiration_month && (card.expiration_month < 1 || card.expiration_month > 12)) {
          throw new Error('Mês de expiração deve estar entre 1 e 12');
        }
        
        if (card.expiration_year && (card.expiration_year < 2024 || card.expiration_year > 2044)) {
          throw new Error('Ano de expiração deve estar entre 2024 e 2044');
        }
        
        if (card.cvv && (card.cvv.length < 3 || card.cvv.length > 4)) {
          throw new Error('CVV deve ter entre 3 e 4 caracteres');
        }
      }
      return true;
    }),
  
  body('pix')
    .optional()
    .custom((pix, { req }) => {
      if (req.body.payment_method === 'pix') {
        if (!pix) {
          throw new Error('Detalhes do PIX são obrigatórios para pagamento via PIX');
        }
        
        if (pix.expires_in_days && (pix.expires_in_days < 1 || pix.expires_in_days > 30)) {
          throw new Error('Dias de expiração do PIX devem estar entre 1 e 30');
        }
      }
      return true;
    }),
  
  body('billet')
    .optional()
    .custom((billet, { req }) => {
      if (req.body.payment_method === 'billet') {
        if (!billet) {
          throw new Error('Detalhes do boleto são obrigatórios para pagamento via boleto');
        }
        
        if (billet.expires_in_days && (billet.expires_in_days < 1 || billet.expires_in_days > 30)) {
          throw new Error('Dias de expiração do boleto devem estar entre 1 e 30');
        }
      }
      return true;
    }),
  
  // Validações opcionais adicionais
  validateOptionalString('shipping.street', 255),
  validateOptionalString('shipping.street_number', 10),
  validateOptionalString('shipping.complement', 255),
  validateOptionalString('shipping.neighborhood', 255),
  validateOptionalString('shipping.city', 255),
  validateOptionalString('shipping.state', 255),
  validateOptionalString('shipping.zip_code', 10),
  validateOptionalString('shipping.country', 255)
];

exports.paymentCodeValidation = [
  param('paymentCode')
    .isString()
    .notEmpty()
    .withMessage('Código de pagamento é obrigatório')
];