const calculatorServices = require("/root/EasyCal/services/calculatorServices");
const logger = require("/root/EasyCal/utils/logger");
const userServices = require("/root/EasyCal/services/userServices");
const debtServices = require("/root/EasyCal/services/debtServices");

const average = async (req, res, next) => {
  try {
    const user = await userServices.findUserById(req.userId);
    const salary = calculatorServices.calculateWeightedAverage(user.salary);
    res.status(200).json({
      status: "successful",
      message: "average salary returned successfully",
      data: { salary },
    });
  } catch (err) {
    logger.error("Calculator Controller/monthly_payment", err);
    next(err);
  }
};

const monthly_payment = async (req, res, next) => {
  const { loanAmount, annualRate, monthRate, numPayment } = req.body;
  try {
    const user = await userServices.findUserById(req.userId);
    const salary = calculatorServices.calculateWeightedAverage(user.salary);
    const monthlyPayment = calculatorServices.calculate_monthly_payment(
      loanAmount,
      annualRate,
      monthRate,
      numPayment
    );
    const Debts = await debtServices.findUserDebt({ userId: req.userId });
    const totalDebt = Debts.reduce((sum, debt, index) => sum + debt.amount, 0);
    let dti = (totalDebt + monthlyPayment) / salary;
    dti = Math.round(dti * 10000) / 100;
    res.status(200).json({
      status: "successful",
      message: "Successfully computed monthly payment and DTI",
      data: { salary, dti },
    });
  } catch (err) {
    logger.error("Calculator Controller/monthly_payment", err);
    next(err);
  }
};

const balance = async (req, res, next) => {
  const { loanAmount, annualRate, numPayment, monthRate, paymentMade } =
    req.body;
  try {
    const total = calculatorServices.calculate_outstanding_balance(
      loanAmount,
      annualRate,
      numPayment,
      monthRate,
      paymentMade
    );
    res.status(200).json({
      status: "successful",
      message: "Successfully retrieved loan balance",
      data: { total },
    });
  } catch (err) {
    logger.error("Calculator Controller/Balance", err);
    next(err);
  }
};

const repayment = async (req, res, next) => {
  const {
    loanAmount,
    annualRate,
    numPayment,
    monthRate,
    paymentMade,
    repaymentMonth,
    penRate,
  } = req.body;
  try {
    const total = calculatorServices.calculate_outstanding_balance(
      loanAmount,
      annualRate,
      numPayment,
      monthRate,
      paymentMade,
      repaymentMonth,
      penRate
    );
    res.status(200).json({
      status: "successful",
      message: "Successfully retrieved loan repayment balance",
      data: { total },
    });
  } catch (err) {
    logger.error("Calculator Controller/Repayment", err);
    next(err);
  }
};

module.exports = {
  average,
  monthly_payment,
  balance,
  repayment,
};
