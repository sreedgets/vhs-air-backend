const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const config = require("../config");
module.exports = (userId) => {
  const randomNumber = uuid.v4();
  const token = jwt.sign({ randomNumber, id: userId }, config.token.key, { expiresIn: config.token.tokenAppTime });
  return token;
}