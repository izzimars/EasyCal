const express = require("express");
const validate = require("../utils/validate");
const schema = require("../schema/debtValidator");
const debtController = require("../controllers/DebtControllers");
const debtrouter = express.Router();
const middleware = require("../utils/middleware");

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
