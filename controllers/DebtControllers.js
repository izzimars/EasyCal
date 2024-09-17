const debtServices = require("root/EasyCalservices/debtServices");
const logger = require("root/EasyCalutils/logger");
const userServices = require("root/EasyCalservices/userServices");

const getDebt = async (req, res, next) => {
  try {
    const data = await debtServices.findUserDebt(req.userId);
    res.status(200).json({
      status: "successful",
      message: `Data successfully retrieved`,
      data,
    });
  } catch (err) {
    if (err.message != "Internal Server Error") {
      logger.error("Debt Controller/getDebt", err);
    }
    next(err);
  }
};

const createDebt = async (req, res, next) => {
  const { debts } = req.body;
  try {
    const debtcount = await userServices.createUserDebt(req.userId, debts);
    res.status(200).json({
      status: "successful",
      message: `${debtcount} successfully created`,
    });
  } catch (err) {
    if (err.message != "Internal Server Error") {
      logger.error("Debt Controller/createDebt", err);
    }
    next(err);
  }
};

const updateDebt = async (req, res, next) => {
  const debtId = req.params.id;
  const debtArr = req.body;
  try {
    const debt = await debtServices.updateDebt(debtId, debtArr);
    logger.info(`Saved updated debt ${debt.id} by user ${req.userId}`);
    return res.status(200).json({
      status: "success",
      message: "Data successfully updated",
      data: debt,
    });
  } catch (err) {
    if (err.message != "Internal Server Error") {
      logger.error("Debt Controller/updateDebt :", err);
    }
    next(err);
  }
};

const deleteDebt = async (req, res, next) => {
  const debtId = req.params.id;
  try {
    await debtServices.deleteDebt(debtId);
    return res.status(200).json({
      status: "success",
      message: "Data successfully deleted",
    });
  } catch (err) {
    if (err.message != "Internal Server Error") {
      logger.error("Debt Controller/deleteDebt :", err);
    }
    next(err);
  }
};

module.exports = {
  createDebt,
  updateDebt,
  getDebt,
  deleteDebt,
};
