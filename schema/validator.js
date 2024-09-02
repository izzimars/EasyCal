const Joi = require("joi");

const signupSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/)
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base": "Password must contain both letters and numbers",
    }),
});

const loginSchema = Joi.object({
  input: Joi.alternatives()
    .try(Joi.string().email(), Joi.string().min(3).max(20))
    .messages({
      "alternatives.match": "Please provide a valid email or username",
      "string.min": "Username must be at least 3 characters long",
      "string.email": "Please provide a valid email address",
    })
    .required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/)
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base": "Password must contain both letters and numbers",
    })
    .required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verifyOTPSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be exactly 6 characters",
    "any.required": "OTP is required",
  }),
});

const resendOTPSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be exactly 6 characters",
    "any.required": "OTP is required",
  }),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/)
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base": "Password must contain both letters and numbers",
    })
    .required(),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
});

const setSalarySchema = Joi.object({
  salaries: Joi.array()
    .items(Joi.number().precision(2).required())
    .max(6)
    .required(),
});

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resendOTPSchema,
  resetPasswordSchema,
  setSalarySchema,
};
