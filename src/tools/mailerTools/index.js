const nodemailer = require("nodemailer");
const config = require("../../config");
const ApiError = require("../../errors/apiError");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: config.mailer.login,
    pass: config.mailer.pass,
  }
},
  {
    from: `Sensor Api <${config.mailer.login}>`
  });

module.exports = (message) => {
  transporter.sendMail(message, (err, info) => {
    if (err) throw ApiError.ServerError(true, "Error send mail", "tools mailer main", err);
  })
}
