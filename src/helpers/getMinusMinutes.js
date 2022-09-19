const getDate = require("./getDate");
module.exports = (minutes) => {
  const date = Date.now();
  const milSec = minutes * 60 * 1000;
  const lastDateSensorMil = date - milSec;
  const lastDate = new Date(lastDateSensorMil);
  return getDate(lastDate);
}