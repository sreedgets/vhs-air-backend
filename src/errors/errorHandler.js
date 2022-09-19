const ApiError = require("./apiError");

module.exports = (err, req, res, next) => {
  if (err instanceof ApiError) {
    if (err.error && err.statusCode === 500) {
      console.log(err);
    }
    if (err.visible) {
      res.status(err.statusCode).json({ message: err.message, error: err.error });
    } else {
      res.status(err.statusCode).json({ message: err.message });
    }
  } else {
    console.log(err);
    res.status(500).json({ message: "Something was wrong" });
  }
}