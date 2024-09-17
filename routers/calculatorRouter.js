const express = require("express");
const validate = require("/root/EasyCal/utils/validate");
const schema = require("/root/EasyCal/schema/calculatorValidator");
const calculatorController = require("/root/EasyCal/controllers/calculatorControlers");
const debtrouter = express.Router();
const middleware = require("/root/EasyCal/utils/middleware");

debtrouter.get(
  "/average",
  middleware.verifyToken,
  calculatorController.average
);

debtrouter.post(
  "/balance",
  validate(schema.balanceSchema, "body"),
  middleware.verifyToken,
  calculatorController.balance
);

debtrouter.post(
  "/monPayment",
  validate(schema.monPaymentSchema, "body"),
  middleware.verifyToken,
  calculatorController.monthly_payment
);

debtrouter.post(
  "/repayment",
  validate(schema.repaymentSchema, "body"),
  middleware.verifyToken,
  calculatorController.repayment
);

module.exports = debtrouter;
