const mailer = require("../mailerTools");
const { Admin } = require("../../db");
const ApiError = require("../../errors/apiError");
const config = require("../../config");
module.exports = async (name, message, phone,emailFrom) => {
  try {
      mailer({
        to: config.contactUs.email,
        subject: "Message from user app",
        html: `<div>
        <p>Message send from: ${name}</p>
        <p>Phone sender: ${phone}</p>
        <p>Email sender: ${emailFrom}</p>
        <p>Message sender:</p>
        <p>${message}</p>
      </div>`,
      });
  } catch (err) {
    throw ApiError.ServerError(true, "Send failed", "tools mailer contact us", err);
  }
}
