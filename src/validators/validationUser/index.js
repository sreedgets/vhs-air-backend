const yup = require("yup");

const schemaValidationUser = yup.object().shape({
  login: yup.string().min(5).max(32).required(),
  password: yup.string().min(5).max(1024).required(),
});
module.exports = schemaValidationUser;