const yup = require("yup");

const schemaContactUs = yup.object().shape({
  message: yup.string().min(20).required().max(2000),
  email: yup.string().min(6).email().required(),
  phone: yup.number().min(4).required(),
  name: yup.string().min(2).max(50).required(),
});
module.exports = schemaContactUs;