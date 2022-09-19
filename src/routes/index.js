module.exports = (app) => {
  require("./adminRouter")(app);
  require("./userRouter")(app);
  require("./sensorRouter")(app);
}