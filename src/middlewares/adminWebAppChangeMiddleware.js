const { AdminToken, Admin, User } = require("../db");
const ApiError = require("../errors/apiError");
const getToken = require("../helpers/getToken");
const verifyAccessAdminToken = require("../helpers/verifyAccessAdminToken");
module.exports = async (req, res, next) => {
  try {
    const bearerToken = getToken(req);
    if (!bearerToken) {
      return next(ApiError.Unauthorized());
    }
    let adminId;
    try {
      adminId = verifyAccessAdminToken(bearerToken);
    } catch (err) {
      throw ApiError.BadRequest(true, "valid token (need refresh)", "authAdminMiddleware", err);
    }
    let admin = await Admin.findById(adminId).select("login email ruleAdmin blockedRec");
    if (!admin) {
      admin = await User.findById(adminId).select("login email");
    }

    if (!admin || admin?._id != adminId) {

      return next(ApiError.Unauthorized());
    }
    req.admin = admin;
    next();
  } catch (err) {
    next();
  }

}