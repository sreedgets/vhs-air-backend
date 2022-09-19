const yup = require("yup");

const schemaValidationAdmin = yup.object().shape({
  from: yup.date(),
  to: yup.date(),
});
module.exports = schemaValidationAdmin;