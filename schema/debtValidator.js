const Joi = require("joi");

const createDebtSchema = Joi.object({
  total: Joi.number().min(0).precision(2),
  monthlyPayment: Joi.number().min(0).precision(3),
  paymentsLeft: Joi.number().min(1).required(),
});

const updatedDebtSchema = Joi.object({
  total: Joi.number().min(0).precision(2),
  monthlyPayment: Joi.number().min(0).precision(3),
  paymentsLeft: Joi.number().min(1).required(),
});

const createDebtArraySchema = Joi.object({
  debts: Joi.array().items(createDebtSchema).min(1).required(),
});

const mongoobjectIdPattern = /^[0-9a-fA-F]{24}$/;

const mongodbSchema = Joi.object({
  id: Joi.string().pattern(mongoobjectIdPattern).required().messages({
    "string.pattern.base": "Invalid MongoDB ObjectID",
  }),
});

module.exports = {
  updatedDebtSchema,
  createDebtArraySchema,
  mongodbSchema,
};
