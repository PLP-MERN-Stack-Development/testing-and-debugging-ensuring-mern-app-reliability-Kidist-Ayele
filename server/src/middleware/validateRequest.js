const validateRequest = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: error.details.map((detail) => detail.message),
    });
  }

  req.body = value;
  next();
};

module.exports = validateRequest;

