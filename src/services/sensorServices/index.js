const { Sensor } = require("../../db");
const ApiError = require("../../errors/apiError");
const filterSensor = require("../../utils/filterData");

module.exports = {
  createSensor: async (name, keySensor, showSensor) => {
    const candidate = await Sensor.findOne({ showSensor });
    if (candidate) {
      throw ApiError.BadRequest(true, "Can`t create sensor repeat", "Create sensor", true);
    }
    const sensor = await Sensor.create({
      name,
      keySensor,
      showSensor,
    })
    return sensor;
  },
  editSensors: async (editArray) => {

    try {
      for (let edit of editArray) {
        let sensor
        try {
          sensor = await Sensor.findById(edit.idSensor);
        } catch (err) {
          throw ApiError.BadRequest(true, "Error find sensor by id", "Sensor service edit", true);
        }
        for (let i = 0; i < sensor.dataSensor.length; i++) {
          if (sensor.dataSensor[i]._id == edit.idData) {
            if (!sensor.dataSensor[i].canEdit) {
              throw ApiError.BadRequest(true, "Can't edit normal data", null, true);
            } else {
              sensor.dataSensor[i].aqi = edit.aqi;
              sensor.dataSensor[i].temperature = edit.temperature;
              sensor.dataSensor[i].humidity = edit.humidity;
              sensor.dataSensor[i].message = filterSensor.getAQIMessage(edit.aqi);
              sensor.dataSensor[i].description = filterSensor.getAQIDescription(edit.aqi);
              sensor.dataSensor[i].edited = true;
              await sensor.save();
            }
          }
        }
      }

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  getFullSensorsData: async () => {
    const sensors = await Sensor.find();
    return sensors;
  },
  getSensors: async (fromDate, toDate, page, size) => {

    const sensorsFull = await Sensor.find().select("name dataSensor");
    let result = [];
    let i = 0;

    for (let sensor of sensorsFull) {

      result.push({
        id: sensor._id,
        name: sensor.name,
        dataSensor: [],
      })
      let j = -1;
      //let j = 0;
      let started = false;
      let bufferDate = null;
      for (let dataS of sensor.dataSensor) {

        let from = new Date(fromDate);
        let now = new Date(dataS.date);
        let to = new Date(toDate);
        bufferDate = (bufferDate) ? bufferDate : now;

        if (from <= now && now <= to) {

          if (
            bufferDate.getFullYear() == now.getFullYear() &&
            bufferDate.getMonth() == now.getMonth() &&
            bufferDate.getDate() == now.getDate() &&
            started
          ) {

            result[i].dataSensor[j].data.push(dataS);
          } else {
            j++;
            started = true;
            bufferDate = new Date(now);
            const date = dataS.date.toLocaleString("en-US", {timeZone: 'America/Chicago'});
            result[i].dataSensor.push({
              DATE: date.split(",")[0],
              data: [dataS],
            })
          }
        }
      }
      i++;
    }
    let limit = parseInt(size);
    let skip = (page - 1) * size;
    for (let sensor of result) {
      let start = sensor.dataSensor.length - skip - 1;
      let finish = sensor.dataSensor.length - skip - limit - 1; //add -1 because array started from [0] index
      let d = [];
      for (let i = start; i > finish; i--) {
        if (!sensor.dataSensor[i]) {
          break;
        }
        d.push(sensor.dataSensor[i]);
      }
      sensor.dataSensor = d;
    }

    return result;
  },
  getTables: async (sensors) => {
    let now = new Date();
    const date = now.toLocaleString("en-US", { timeZone: "America/Regina" });
    const timeNow = date.split(",")[1];
    const dateNow = date.split(",")[0];
    let table = [];
    for (let s of sensors) {
      let sensor = {
        id: s._id,
        name: s.name,
        current: {
          empty: true
        },
        am7: {
          empty: true
        },
        am11: {
          empty: true
        },
        pm3: {
          empty: true
        },
        pm7: {
          empty: true
        }
      };
      s.dataSensor.forEach(data => {
        if (s.lastRecord == data.date) {
          sensor.current = data;
        }

        if (data.date == `${dateNow}, 7:00:00 AM`) {
          sensor.am7 = data;
        } else if (data.date == `${dateNow}, 11:00:00 AM`) {
          sensor.am11 = data;
        } else if (data.date == `${dateNow}, 3:00:00 PM`) {
          sensor.pm3 = data;
        } else if (data.date == `${dateNow}, 7:00:00 PM`) {
          sensor.pm7 = data;
        }

      });
      table.push(sensor);
    }
    return table;
  }
}