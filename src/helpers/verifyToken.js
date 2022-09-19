const jwt = require("jsonwebtoken");
const config = require("../config");
module.exports = (token) => {
  const { id } = jwt.verify(token, config.token.key);
  if (!id) {
    return null;
  }
  return id;
}