const express = require("express");
const validate = require("/root/EasyCalutils/validate");
const schema = require("/root/EasyCalschema/validator");
const userController = require("/root/EasyCalcontrollers/userControllers");
const userrouter = express.Router();
const middleware = require("/root/EasyCalutils/middleware");

userrouter.post(
  "/signup",
  validate(schema.signupSchema, "body"),
  userController.signup
);

userrouter.post(
  "/login",
  validate(schema.loginSchema, "body"),
  userController.login
);

userrouter.post(
  "/forgotPassword",
  validate(schema.forgotPasswordSchema, "body"),
  userController.forgotPassword
);

userrouter.post(
  "/VerifyOTP",
  validate(schema.verifyOTPSchema, "body"),
  userController.verifyPasswordOtp
);

userrouter.post(
  "/resendOTP",
  validate(schema.resendOTPSchema, "body"),
  userController.resendOTPCode
);

userrouter.post(
  "/resetPassword",
  validate(schema.resetPasswordSchema, "body"),
  userController.resetPassword
);

userrouter.post(
  "/setSalary",
  validate(schema.setSalarySchema, "body"),
  middleware.verifyToken,
  userController.setSalary
);

userrouter.post("/getSalary", middleware.verifyToken, userController.getSalary);

module.exports = userrouter;
