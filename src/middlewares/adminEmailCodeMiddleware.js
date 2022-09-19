const { Admin } = require("../db");
const ApiError = require("../errors/apiError");
module.exports = async (req, res, next) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    ApiError.BadRequest(true, "Admin by email not found", "adminEmailCodeMiddleware", true);
  }
  if (admin.blockedRec) {
    next(ApiError.Forbidden());
  } else {
    next();
  }
}