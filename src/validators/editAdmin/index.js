const yup = require("yup");

const schemaValidationEditAdmin = yup.object().shape({
  password: yup.string().min(5).max(1024).required(),
});
module.exports = schemaValidationEditAdmin;