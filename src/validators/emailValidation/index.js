const yup = require("yup");

const schemaEmailAdmin = yup.object().shape({
  email: yup.string().email().required().min(5),
});
module.exports = schemaEmailAdmin;