const ApiError = require("../errors/apiError");

function getToken(req) {
  if (!req.headers["authorization"]) {
    throw ApiError.Unauthorized();
  }
  const authHeader = req.headers["authorization"];
  const [, token] = authHeader && authHeader.split(" ");
  return token
}

module.exports = getToken;
