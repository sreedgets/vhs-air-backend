const ApiError = require("../errors/apiError");
module.exports = (req) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw ApiError.Unauthorized();
  }
  return refreshToken.split(' ')[1];
}