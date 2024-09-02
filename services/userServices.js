const User = require("../models/userModel");
const debtServices = require("../services/debtServices");
const logger = require("../utils/logger");

const findUserByOne = async (field, value) => {
  try {
    const query = {};
    query[field] = value;
    const user = await User.findOne(query);
    return user;
  } catch (err) {
    logger.error("UserServices/findUserByone", err);
    const error = new Error("User not Error");
    error.message = "User not Error";
    error.status = 404;
    throw error;
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (err) {
    logger.error("UserServices/findUserById", err);
    const error = new Error("User not Error");
    error.message = "User not Error";
    error.status = 404;
    throw error;
  }
};

const findUserAcc = async (input) => {
  try {
    const user = await User.find(input);
    return user;
  } catch (err) {
    logger.info(err.message);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    logger.info(`User ${user._id} successfully created`);
    return user;
  } catch (err) {
    logger.error("UserServices/CreateUser", err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

const updateUserByOne = async (userId) => {
  try {
    const user = await User.updateOne({ _id: userId }, { verified: true });
    logger.info(`User profile successfully updated ${userId}`);
  } catch (err) {
    logger.error("UserServices/updateUserByOne", err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

const setUserSalaryId = async (userId, salaries) => {
  try {
    const user = await User.findById(userId);
    user.salary = salaries;
    user.updatedMonth = new Date().getMonth() + 1;
    await user.save();
    return user;
  } catch (err) {
    logger.error("UserServices/setUserSalaryId", err);
    const error = new Error("Internal Server Error");
    error.message = "Internal Server Error";
    error.status = 500;
    throw error;
  }
};

const createUserDebt = async (userId, debts) => {
  try {
    let sucArr = await debts.map(async (i) => {
      const temp = await debtServices.createDebt({
        userId: userId,
        total: i.total,
        monthlyPayment: i.monthlyPayment,
        paymentsLeft: i.paymentsLeft,
        updatedMonth: new Date().getMonth() + 1,
      });
      return temp;
    });
    const tempArr = await Promise.all(sucArr);
    const sucCount = tempArr.reduce((sum, i) => {
      return sum + i;
    }, 0);
    return sucCount;
  } catch (err) {
    logger.error("UserServices/createUserDebt", err);
    const error = new Error("Internal Server Error");
    error.message = "Internal Server Error";
    error.status = 500;
    throw error;
  }
};

module.exports = {
  findUserByOne,
  createUser,
  updateUserByOne,
  findUserById,
  setUserSalaryId,
  createUserDebt,
  findUserAcc,
};
