const { Token, User, Admin } = require("../db");
const ApiError = require("../errors/apiError");
const getToken = require("../helpers/getToken");
const verifyToken = require("../helpers/verifyToken");
module.exports = async (req, res, next) => {
  try {
    if (req.admin) {
      next();
      return;
    }
    const bearerToken = getToken(req);
    if (!bearerToken) {
      return next(ApiError.Unauthorized());
    }
    let userIdFromToken
    try {
      userIdFromToken = verifyToken(bearerToken);
    } catch (err) {
      throw ApiError.BadRequest(true, "valid token (verify)", "authMiddleware", err);
    }
    let userToken;
    let userId;
    try {
      userToken = await Token.findOne({ token: bearerToken });
      userId = userToken.userId;
    } catch (err) {
      return next(ApiError.Unauthorized());
    }
    if (userIdFromToken != userId) {
      throw ApiError.Unauthorized();
    }
    let user = await User.findById(userId).select("login");
    if (!user) {
      user = await Admin.findById(userId).select("login ruleAdmin");
      if (!user) {
        return next(ApiError.Unauthorized());
      }
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }

}