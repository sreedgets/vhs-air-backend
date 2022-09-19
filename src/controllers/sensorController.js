const sensorServices = require("../services/sensorServices");
module.exports = {
  editSensor: async (req, res, next) => {
    try {
      const { editArray } = req.validate;
      const editedSensors = await sensorServices.editSensors(editArray);
      if (editedSensors) {
        res.json({ editedSensors, message: "Sensors edit success" });
      } else {
        res.json({ editedSensors, message: "Sensors data not found or strange error" });
      }

    } catch (err) {
      next(err);
    }
  },
  editSensorApp: async (req, res, next) => {
    try {
      const { idSensor, idData, aqi, temperature, humidity } = req.validate;

      if (!idSensor || !idData || (!aqi && aqi !== 0) || (!temperature && temperature !== 0) || (!humidity && humidity !== 0)) {
        throw ApiError.BadRequest(true, "Not input ID-sensor or ID-data or AQI etc.", "edit sensor", true);
      }
      const editedSensor = await sensorServices.editSensors([{ idSensor, idData, aqi, temperature, humidity }]);
      if (editedSensor) {
        res.json({ editedSensor, message: "Sensor edit success" });
      } else {
        res.json({ editedSensor, message: "Sensor data not found or strange error" });
      }

    } catch (err) {
      next(err);
    }
  },
  getTable: async (req, res, next) => {
    try {
      const sensors = await sensorServices.getFullSensorsData();
      const table = await sensorServices.getTables(sensors);
      res.json(table);
    } catch (err) {
      next(err);
    }
  }
}