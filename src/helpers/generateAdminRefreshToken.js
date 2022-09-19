const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const config = require("../config");

module.exports = (adminId) => {
  const randomNumber = uuid.v4();
  const token = jwt.sign({ randomNumber }, config.token.refreshKey, { expiresIn: config.token.refreshLife });
  return token;
}