const yup = require("yup");

const schemaValidationUser = yup.object().shape({
  firstName: yup.string().min(2).max(32),
  secondName: yup.string().min(2).max(32),
  login: yup.string().min(5).max(32),
  password: yup.string().min(5).max(1024),
});
module.exports = schemaValidationUser;