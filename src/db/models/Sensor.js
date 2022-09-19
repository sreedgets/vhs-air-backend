const { model, Schema } = require("mongoose");

const dataSchema = new Schema({
  aqi: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: "-",
  },
  message: {
    type: String,
    default: "-",
  },
  temperature: {
    type: String,
    default: "0",
  },
  humidity: {
    type: String,
    default: "-",
  },
  date: {
    type: String,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
  edited: {
    type: Boolean,
    default: false,
  }
});
const sensorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  showSensor: {
    type: String,
    required: true,
  },
  keySensor: {
    type: String,
    required: true,
  },
  lastRecord: {
    type: String,
    default: "-",
  },
  dataSensor: {
    type: [dataSchema],
    default: [],
  }
})

module.exports = model("sensor", sensorSchema);