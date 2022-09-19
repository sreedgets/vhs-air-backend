const { User, Admin } = require("../../db");
const ApiError = require("../../errors/apiError");
const bCrypt = require("bcrypt");
const tokenService = require("../tokenServices");


module.exports = {
  logination: async (login, password) => {
    let user = await User.findOne({ login });
    if (!user) {
      user = await Admin.findOne({ login });
      if (!user) {
        throw ApiError.BadRequest(true, "Invalid login or password", "logination", true);
      }
    }
    const isEquals = await bCrypt.compare(password, user.password);
    if (!isEquals) {
      throw ApiError.BadRequest(true, "Invalid login or password", "logination", true);
    }
    const token = await tokenService.getTokenByUserId(user._id);
    return token;
  },
  logout: async (userId) => {
    const deleted = await tokenService.deleteToken(userId);
    if (!deleted) {
      throw ApiError.BadRequest(false, "Something was wrong with token, can't find in db, bad logout", "userService logout", true);
    }
    return deleted;
  }
}