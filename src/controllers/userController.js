const ApiError = require("../errors/apiError");
const userService = require("../services/userServices");
const mailercUs = require("../tools/mailerContactUs");
module.exports = {
  logination: async (req, res, next) => {
    try {
      const { login, password } = req.body;
      if (!login || !password) {
        throw ApiError.BadRequest(true, "Not input login or password", "logination", true);
      }
      const token = await userService.logination(login, password);
      if (token) {
        res.json({ loginSuccess: true, token, });
      } else {
        res.json({ loginSuccess: false, });
      }
    } catch (err) {
      next(err);
    }
  },
  logOut: async (req, res, next) => {
    try {
      const { user } = req;
      const deletedToken = await userService.logout(user._id);
      res.json({ logoutSuccess: deletedToken });
    } catch (err) {
      next(err);
    }
  },
  contactUs: async (req, res, next) => {
    try {
      const { email, message, phone, name } = req.body;
      if (!email || !message) {
        throw ApiError.BadRequest(true, "Not input email or message", "Contact us", true);
      }
      await mailercUs(name, message, phone, email);
      res.json({ message: "Message send", messageSended: true });
    } catch (err) {
      next(err);
    }
  },
}