const validate = (schema, type = "body") => {
  return (req, res, next) => {
    const data = req[type];
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors: errorDetails });
    }

    next();
  };
};

module.exports = validate;
