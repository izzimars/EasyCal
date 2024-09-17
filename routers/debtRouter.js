const express = require("express");
const validate = require("/root/EasyCalutils/validate");
const schema = require("/root/EasyCalschema/debtValidator");
const debtController = require("/root/EasyCalcontrollers/DebtControllers");
const debtrouter = express.Router();
const middleware = require("/root/EasyCalutils/middleware");

debtrouter.post(
  "/:id",
  middleware.verifyToken,
  validate(schema.mongodbSchema, "params"),
  validate(schema.updatedDebtSchema, "body"),
  debtController.updateDebt
);

debtrouter.post(
  "/",
  middleware.verifyToken,
  validate(schema.createDebtArraySchema, "body"),
  debtController.createDebt
);

debtrouter.delete(
  "/:id",
  middleware.verifyToken,
  validate(schema.mongodbSchema, "params"),
  debtController.deleteDebt
);

debtrouter.get("/", middleware.verifyToken, debtController.getDebt);

module.exports = debtrouter;
