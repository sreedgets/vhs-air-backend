const mailer = require("../mailerTools");
const { Admin } = require("../../db");
const ApiError = require("../../errors/apiError");
const getMinusMinutes = require("../../helpers/getMinusMinutes");
module.exports = async (location, date, message, ...age) => {
  try {
    const admin = await Admin.findOne();

    if (age.lenght === 1) {
      const dateBreak = getMinusMinutes(age[0]);
      mailer({
        to: admin.email,
        subject: "Data from sensor not found",
        html: `<div>
        <p>Location: ${location}</p>
        <p>Time get data: ${date}<p/>
        <p></p>
        <p>Sensor breakdown moment: ${dateBreak}</p>
        <p>${message}</p>
      <div/>`,
      });
    } else {
      const dateBreak = getMinusMinutes((age[0] <= age[1]) ? age[0] : age[1]);
      mailer({
        to: admin.email,
        subject: "Data from sensor not found",
        html: `<div>
        <p>Location: ${location}</p>
        <p>Time get data: ${date}<p/>
        <p>Sensor breakdown moment: ${dateBreak}</p>
        <p>${message}</p>
      <div/>`,
      });
    }
  } catch (err) {
    throw ApiError.ServerError(true, "Send failed by sensor", "Mailer for break sensor", err);
  }
}
