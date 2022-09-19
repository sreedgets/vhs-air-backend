const jwt = require("jsonwebtoken");
const config = require("../config");
module.exports = (token) => {
  return new Promise(resolve => {
    jwt.verify(token, config.token.refreshKey, err => {
      if (err) {
        resolve(false);
      } else resolve(true);
    })
  })
}