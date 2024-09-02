const Joi = require("joi");

const balanceSchema = Joi.object({
  loanAmount: Joi.number().min(0).precision(2).required(),
  annualRate: Joi.number().min(0).precision(3),
  numPayment: Joi.number().min(1).required(),
  monthRate: Joi.number().min(0).precision(3),
  paymentMade: Joi.number().min(0).required(),
}).or("annualRate", "monthRate");

const monPaymentSchema = Joi.object({
  loanAmount: Joi.number().min(0).precision(2).required(),
  annualRate: Joi.number().min(0).precision(3),
  monthRate: Joi.number().min(0).precision(3),
  numPayment: Joi.number().min(1).required(),
}).or("annualRate", "monthRate");

const repaymentSchema = Joi.object({
  loanAmount: Joi.number().min(0).precision(2).required(),
  annualRate: Joi.number().min(0).precision(3),
  numPayment: Joi.number().min(1).required(),
  monthRate: Joi.number().min(0).precision(3),
  paymentMade: Joi.number().min(0).required(),
  repaymentMonth: Joi.number().min(0).required(),
  penRate: Joi.number().min(0).precision(3).required(),
}).or("annualRate", "monthRate");

module.exports = {
  balanceSchema,
  monPaymentSchema,
  repaymentSchema,
};
