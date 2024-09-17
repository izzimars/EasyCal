const Debt = require("root/EasyCalmodels/debtModel");
const logger = require("root/EasyCalutils/logger");

const findDebtById = async (debtId) => {
  try {
    const debt = await Debt.findById(debtId);
    return debt;
  } catch (err) {
    logger.error("DebtServices/findDebtById", err);
    let error = new Error("Internal server error");
    error.status = 500;
    error.message = "Internal Server Error";
    throw error;
  }
};

const createDebt = async (debtData) => {
  try {
    const debt = new Debt(debtData);
    await debt.save();
    return 1;
  } catch (err) {
    logger.error("DebtServices/createDebt", err);
    return -1;
  }
};

const updateDebt = async (debtId, debtArr) => {
  try {
    let debt = await findDebtById(debtId);
    debt.total = debtArr.total;
    debt.monthlyPayment = debtArr.monthlyPayment;
    debt.paymentsLeft = debtArr.paymentsLeft;
    debt.updatedMonth = new Date().getMonth() + 1;
    await debt.save();
    return debt;
  } catch (err) {
    logger.error("DebtServices/updatedDebt", err);
    const error = new Error("Internal server error");
    error.status = 500;
    error.message = "Internal Server Error";
    throw error;
  }
};

const deleteDebt = async (debtId) => {
  try {
    await Debt.deleteOne({ _id: debtId });
  } catch (err) {
    logger.error("DebtServices/updatedDebt", err);
    const error = new Error("Internal server error");
    error.status = 500;
    error.message = "Internal Server Error";
    throw error;
  }
};

const findUserDebt = async (userId) => {
  try {
    const debt = await Debt.find({ userId });
    return debt;
  } catch (err) {
    logger.error("DebtServices/findUserDebt", err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    error.message = "Internal Server Error";
    throw error;
  }
};
module.exports = {
  createDebt,
  updateDebt,
  findUserDebt,
  deleteDebt,
};
