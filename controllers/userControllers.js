const userServices = require("root/EasyCalservices/userServices");
const logger = require("root/EasyCalutils/logger");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("root/EasyCalutils/config");
const otpServices = require("root/EasyCalservices/otpServices");
const emailServices = require("root/EasyCalservices/emailServices");
const calculatorServices = require("root/EasyCalservices/calculatorServices");
const debtServices = require("root/EasyCalservices/debtServices");

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    let user = await userServices.findUserByOne("email", email);
    if (user) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }
    user = await userServices.findUserByOne("username", username);
    if (user) {
      return res.status(400).json({
        status: "error",
        message: "Username is already taken",
      });
    }
    user = await userServices.createUser({
      username,
      email,
      password,
    });
    res.status(200).json({
      status: "PENDING",
      message: "Verification OTP sent",
      data: { email },
    });
  } catch (err) {
    logger.error("Authentication/Signup:", err);
    next(err);
  }
};

const login = async (req, res, next) => {
  const { input, password } = req.body;
  try {
    let user = await userServices.findUserByOne("username", input);
    if (!user) {
      user = await userServices.findUserByOne("email", input);
    }
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        status: "error",
        message: "Invalid credentials",
      });
    }
    logger.info(`User ${user.username} has been successfully signed in.`);
    const token = jwt.sign({ userId: user._id }, config.SECRET);
    const salary = calculatorServices.calculateWeightedAverage(user.salary);
    const Debts = await debtServices.findUserDebt(user.id);
    const totalDebt = Debts.reduce((sum, debt) => sum + debt.total, 0);
    let dti = Math.round((totalDebt / salary) * 10000) / 100;
    //await redisService.setArray(user._id.toString(), [token, refreshtoken]);
    return res.status(200).json({
      status: "success",
      message: "user signed in successfully",
      data: {
        token: token,
        username: user.username,
        verified: user.verified,
        lastMonthUpdated: user.updatedMonth,
        DTI: dti,
        debts: totalDebt,
        salary: salary,
      },
    });
  } catch (err) {
    logger.error("Authentication/Verify:", err);
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await userServices.findUserByOne("email", email);
    if (user) {
      user.verified = false;
      await user.save();
      logger.info(`Send token to reset password to ${user._id}`);
      await otpServices.deleteUserOtpsByUserId(user._id);
      let otp = await otpServices.createUserOtp(user._id);
      await emailServices.sendOtpEmail(user.email, otp);
      return res.status(200).json({
        status: "success",
        message: "OTP sent successfully",
        data: { email },
      });
    } else {
      const error = new Error();
      error.status = 404;
      error.message = "Email Does Not Exist";
      throw error;
    }
  } catch (err) {
    logger.error("Authentication/forgotPassword:", err);
    next(err);
  }
};

const verifyPasswordOtp = async (req, res, next) => {
  try {
    let { email, otp } = req.body;
    const user = await userServices.findUserByOne("email", email);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User does not exists please re-route to sign up page",
      });
    }
    const userotprecord = await otpServices.findUserOtpByUserId(user._id);
    if (!userotprecord) {
      return res.status(404).json({
        status: "error",
        message: "Invalid OTP",
      });
    } else {
      const hashedotp = userotprecord.otp;
      const expiresat = userotprecord.expiresat;
      if (expiresat < Date.now()) {
        await otpServices.deleteUserOtpsByUserId(user._id);
        return res.status(404).json({
          status: "error",
          message: "OTP has expired",
        });
      } else {
        const validotp = await bcrypt.compare(otp, hashedotp);
        if (!validotp) {
          return res.status(404).json({
            status: "error",
            message: "Invalid OTP",
          });
        }
        logger.info(`OTP valid for ${email}`);
        return res.status(200).json({
          status: "success",
          message: "valid OTP",
        });
      }
    }
  } catch (err) {
    logger.error("Authentication/Verify:", err);
    next(err);
  }
};

const resendOTPCode = async (req, res, next) => {
  try {
    let { email } = req.body;
    const user = await userServices.findUserByOne("email", email);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User has no records",
      });
    }
    await otpServices.deleteUserOtpsByUserId(user._id);
    let otp = await otpServices.createUserOtp(user._id);
    await emailServices.sendOtpEmail(user.email, otp);
    logger.info(`Email sent to ${user._id}`);
    return res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
      data: { email },
    });
  } catch (err) {
    logger.error("Authentication/Verify:", err);
    next(err);
  }
};

const resetPassword = async (req, res) => {
  const { email, password, otp } = req.body;
  try {
    const user = await userServices.findUserByOne("email", email);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    const userotprecord = await otpServices.findUserOtpByUserId(user._id);
    const validOtp = bcrypt.compare(otp, userotprecord.otp);
    if (!validOtp || userotprecord.expiresat < Date.now()) {
      return res.status(404).json({
        status: "error",
        message: "Expired OTP",
      });
    }
    user.password = password;
    user.verified = true;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "password successfully changed",
    });
  } catch (err) {
    logger.error("Authentication/forgotPassword:", err);
    next(err);
  }
};

const setSalary = async (req, res) => {
  let { salaries } = req.body;
  try {
    salaries = salaries.map((i) => Math.round(i * 100) / 100);
    await userServices.setUserSalaryId(req.userId, salaries);
    return res.status(200).json({
      status: "success",
      message: "salary entries sucessfully updated",
    });
  } catch (err) {
    logger.error("UsersController/setSalary:", err);
    next(err);
  }
};

const getSalary = async (req, res) => {
  try {
    const user = await userServices.findUserById(req.userId);
    return res.status(200).json({
      status: "success",
      message: "salary entries sucessfully retrieved",
      data: user.salary,
    });
  } catch (err) {
    logger.error("UsersController/getSalary:", err);
    next(err);
  }
};

const profilePicture = async (req, res) => {
  try {
    const user = await userServices.findUserByOne("_id", req.userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    user.profilePicture = req.file.path; // Cloudinary file path
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Profile picture successfully uploaded",
      data: {
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    logger.error("Settings/profilePicture: ", err);
    if (err.status != 500) {
      err.status = 500;
    }
    next(err);
  }
};

const profilePictureDelete = async (req, res) => {
  try {
    const user = await userServices.findUserByOne("_id", req.userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    if (user.profilePicture) {
      await cloudinary.uploader.destroy(user.profilePicture);
    }
    user.profilePicture = ""; // Cloudinary file path
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Profile picture successfully deleted",
      data: {
        profilePicture: "",
      },
    });
  } catch (err) {
    logger.error("Settings/profilePictureDelete: ", err);
    if (err.status != 500) {
      err.status = 500;
    }
    next(err);
  }
};

const personalinfopost = async (req, res, next) => {
  const { fullname, username, phonenumber } = req.body;
  try {
    let user = await userServices.findUserByOne("_id", req.userId);
    let usersname = await userServices.findUserByOne("username", username);
    if (usersname && !(usersname.username == user.username)) {
      return res.status(400).json({
        status: "error",
        message: "Username is already taken",
      });
    }
    user.fullname = fullname || user.fullname;
    user.username = username || user.username;
    user.phonenumber = phonenumber || user.phonenumber;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "User details successfully edited",
    });
  } catch (err) {
    logger.error("user/setup: ", err);
    next(err);
  }
};

const changeemail = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await userServices.findUserByOne("email", email);
    if (user) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }
    user = await userServices.findUserByOne("_id", req.userId);
    user.verified = false;
    user.email = email;
    await user.save();
    await otpServices.deleteUserOtpsByUserId(user._id);
    let otp = await otpServices.createUserOtp(user._id);
    await emailServices.sendOtpEmail(email, otp);
    return res.status(200).json({
      status: "success",
      message: "OTP successfully sent",
      data: { email },
    });
  } catch (err) {
    logger.error("user/changeemail: ", err);
    next(err);
  }
};

const changeemailverify = async (req, res) => {
  const { otp } = req.body;
  try {
    const userotprecord = await otpServices.findUserOtpByUserId(req.userId);
    if (!userotprecord) {
      return res.status(404).json({
        status: "error",
        message: "Restricted access to user",
      });
    }
    const hashedotp = userotprecord.otp;
    const expiresat = userotprecord.expiresat;
    if (expiresat < Date.now()) {
      await otpServices.deleteUserOtpsByUserId(req.userId);
      return res.status(404).json({
        status: "error",
        message: "OTP has expired",
      });
    }
    const validotp = await bcrypt.compare(otp, hashedotp);
    if (!validotp) {
      return res.status(404).json({
        status: "error",
        message: "Invalid OTP",
      });
    }
    await userServices.updateUserByOne(req.userId);
    await otpServices.deleteUserOtpsByUserId(req.userId);
    return res.status(200).json({
      status: "success",
      message: "User email verified successfully",
    });
  } catch (err) {
    logger.error("user/changeemail/verify: ", err);
    next(err);
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  verifyPasswordOtp,
  resendOTPCode,
  resetPassword,
  setSalary,
  getSalary,
  profilePicture,
  profilePictureDelete,
  personalinfopost,
  changeemail,
  changeemailverify,
};
