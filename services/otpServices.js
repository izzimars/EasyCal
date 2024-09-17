const Otp = require("/root/EasyCal/models/otpModel");
const logger = require("/root/EasyCal/utils/logger");
const bcrypt = require("bcryptjs");

const deleteUserOtpsByUserId = async (userId) => {
  try {
    await Otp.deleteMany({ userId: userId });
    logger.info(`Deleted former otp for ${userId}`);
  } catch (err) {
    logger.info("OTPServices/deleteUserOtpsByUserId", err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

const createUserOtp = async (userId) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const newotp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const hashedOTP = await bcrypt.hash(newotp, salt);
    const userOtp = new Otp({
      userId: userId,
      otp: hashedOTP,
      createdat: Date.now(),
      expiresat: Date.now() + 360000,
    });
    await userOtp.save();
    return newotp;
  } catch (err) {
    logger.info("OTPServices/createUserOtp", err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

const findUserOtpByUserId = async (userId) => {
  try {
    const otpDetail = await Otp.findOne({ userId: userId });
    logger.info(`Otp details found for ${userId}`);
    return otpDetail;
  } catch (err) {
    logger.info("OTPServices/findUserOtpByUserId", err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};
module.exports = { deleteUserOtpsByUserId, createUserOtp, findUserOtpByUserId };
