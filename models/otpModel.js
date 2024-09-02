const mongoose = require("mongoose");

const UserOTPVerificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  otp: String,
  createdat: Date,
  expiresat: Date,
});

const UserOTPVerification = mongoose.model(
  "UserOTPVerification",
  UserOTPVerificationSchema
);

module.exports = UserOTPVerification;
