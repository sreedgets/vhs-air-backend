const adminServices = require("../src/services/adminServices");
const ApiError = require("../src/errors/apiError");
const path = require("path")
module.exports = {
  sendFile: async (req, res, next) => {
    try {
      const { from, to } = req.body;
      const fileWrited = await adminServices.reports(
        from, to);

      if (fileWrited) {
        res.sendFile("reports.xlsx", { root: path.join(__dirname, "report") });
      } else {
        throw ApiError.ServerError(true, "Send file error", "get report", true);
      }
    } catch (err) {
      next(err);
    }
  }
}