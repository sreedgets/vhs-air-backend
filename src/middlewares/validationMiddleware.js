const ApiError = require("../errors/apiError");

module.exports = (schema) => async (req, res, next) => {
  const { body } = req;
  try {
    const validate = await schema.validate(body);
    req.validate = validate;
    next();
  } catch (err) {
    if (err.name == "ValidationError") {
      next(ApiError.BadRequest(true, "Validation Error", "validationMiddleware", err.errors));
    }else{
      next(ApiError.ServerError(false, "Validation Error", "validationMiddleware", err));
    }
  }
}