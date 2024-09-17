const logger = require("root/EasyCalutils/logger");

const calculateWeightedAverage = (salaries) => {
  try {
    const weights = [1, 2, 3, 4, 5, 6];
    const lent = salaries.length;
    const totalWeight = weights.reduce((sum, weight, index) => {
      if (index < lent) {
        return (sum = sum + weight);
      } else {
        return sum;
      }
    }, 0);
    const weightedSum = salaries.reduce((sum, salary, index) => {
      return sum + salary * weights[index];
    }, 0);
    return Math.round((weightedSum / totalWeight) * 100) / 100;
  } catch (err) {
    logger.error("CalculatorServices/calculateWeightedAverage", err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    error.message = "Internal Server Error";
    throw error;
  }
};

const calculate_monthly_payment = (
  principal,
  annual_rate,
  monthly_rate,
  num_payments
) => {
  monthly_rate = monthly_rate > 0 ? monthly_rate : annual_rate / 12;
  let tempValue =
    (principal * monthly_rate) / (1 - (1 + monthly_rate) ** -num_payments);
  return Math.round(tempValue * 100) / 100;
};

const calculate_outstanding_balance = (
  principal,
  annual_rate,
  num_payments,
  monthly_rate,
  payments_made
) => {
  monthly_rate = monthly_rate ? monthly_rate : annual_rate / 12;
  let balance =
    principal * (1 + monthly_rate) ** payments_made -
    (calculate_monthly_payment(
      principal,
      annual_rate,
      monthly_rate,
      num_payments
    ) *
      ((1 + monthly_rate) ** payments_made - 1)) /
      monthly_rate;
  balance = Math.round(balance * 100) / 100;
  return balance;
};

const calculate_early_repayment = (
  principal,
  annual_rate,
  monthly_rate,
  num_payments,
  payments_made,
  early_repayment_months,
  penalty_rate
) => {
  //Calculate the balance if repaid early
  let remaining_payments = num_payments - payments_made;
  if (early_repayment_months < remaining_payments) {
    adjusted_num_payments = remaining_payments - early_repayment_months;
  } else {
    adjusted_num_payments = 0;
  } // Full repayment

  let adjusted_balance = calculate_outstanding_balance(
    principal,
    annual_rate,
    num_payments,
    monthly_rate,
    payments_made + early_repayment_months
  );
  //Apply penalty if applicable
  let penalty = Math.round(adjusted_balance * penalty_rate * 100) / 100;
  let total_repayment = Math.round((adjusted_balance + penalty) * 100) / 100;
  return { adjusted_balance, penalty, total_repayment };
};

module.exports = {
  calculateWeightedAverage,
  calculate_early_repayment,
  calculate_outstanding_balance,
  calculate_monthly_payment,
};
