const ApiError = require("../errors/apiError");
module.exports = (req, res, next) => {
  try {
    const { admin } = req;
    if (admin.ruleAdmin) {
      return next();
    }
    next(ApiError.Forbidden("Admin auth"));
  } catch (err) {
    console.log(err);
    next(ApiError.Forbidden("Error admin auth"));
  }
}