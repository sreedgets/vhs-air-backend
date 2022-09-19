const sensorController = require("../controllers/sensorController");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");
const { SensorEditDataValidation } = require("../validators")
module.exports = (app) => {
  app.put("/sensors/changeData",
    authMiddleware,
    validationMiddleware(SensorEditDataValidation),
    sensorController.editSensorApp);
  app.get("/sensors/table", sensorController.getTable);
}