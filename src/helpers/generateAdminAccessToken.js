const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const config = require("../config");
module.exports = (adminId) => {
  const randomNumber = uuid.v4();
  const token = jwt.sign({ randomNumber, id: adminId }, config.token.key, { expiresIn: config.token.accessLife });
  return token;
}