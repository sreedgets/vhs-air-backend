const yup = require("yup");

const schemaValidationData = yup.object().shape({
  editArray:yup.array(
    yup.object({
      idSensor: yup.string().required(),
      idData: yup.string().required(),
      aqi: yup.number().min(0).max(1000).required(),
      temperature: yup.number().min(-126).max(136).required(),
      humidity: yup.number().min(0).max(100).required()
    })
  ).required()
});
module.exports = schemaValidationData;