const yup = require("yup");

const schemaValidationAdmin = yup.object().shape({
  ruleAdmin: yup.boolean().default(true),
  email: yup.string().min(5).max(64).email().required(),
  login: yup.string().min(5).max(32).required(),
  password: yup.string().min(5).max(1024).required(),
});
module.exports = schemaValidationAdmin;