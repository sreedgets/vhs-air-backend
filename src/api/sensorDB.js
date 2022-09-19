const axios = require("axios").default;
const cron = require("node-cron");
const { aqiFromPM, getAQIDescription, getAQIMessage } = require("../utils/filterData");
const mailerBreak = require("../tools/mailerSensorBreak");
const sensorServices = require("../services/sensorServices");
const { Sensor } = require("../db");
const getDate = require("../helpers/getDate")
module.exports = async () => {
    cron.schedule("0 0 3,7,12,17,22 * * *", async () => {
        const dateNow = new Date();
        const date = getDate(dateNow);
        const sensors = await sensorServices.getFullSensorsData();
        let connSensors = new Map();
        for (let sensor of sensors) {
            let { showSensor } = sensor;
            let { keySensor } = sensor;
            connSensors.set(showSensor, keySensor);
        }

        connSensors.forEach(async (value, key, map) => {
            try {
            let sensor = await Sensor.findOne({ showSensor: key });
            const { data } = await axios.get(`https://www.purpleair.com/json?key=${value}&show=${key}`);
            const [sensor1, sensor2] = data.results;
            if (sensor1.AGE <= 2 && sensor2.AGE <= 2) {
                const aqi_sensor1 = aqiFromPM(sensor1.PM2_5Value);
                const aqi_sensor2 = aqiFromPM(sensor2.PM2_5Value);
                const aqi_average = (aqi_sensor1 + aqi_sensor2) / 2;
                const aqi_description = getAQIDescription(aqi_average);
                const aqi_message = getAQIMessage(aqi_average);
                const humidity = sensor1.humidity;
                const temp_f = sensor1.temp_f;

                sensor.lastRecord = date;
                sensor.dataSensor.push({
                aqi: aqi_average,
                description: aqi_description,
                message: aqi_message,
                temperature: temp_f,
                humidity,
                date,
                });
                await sensor.save();
            } else if (sensor1.AGE < 2 && sensor2.AGE > 2) {
                const aqi_sensor1 = aqiFromPM(sensor1.PM2_5Value);
                const aqi_average = aqi_sensor1
                const aqi_description = getAQIDescription(aqi_average);
                const aqi_message = getAQIMessage(aqi_average);
                const humidity = sensor1.humidity;
                const temp_f = sensor1.temp_f;

                sensor.lastRecord = date;
                sensor.dataSensor.push({
                aqi: aqi_average,
                description: aqi_description,
                message: aqi_message,
                temperature: temp_f,
                humidity,
                date,
                canEdit: true,
                edited: true,
                });
                await sensor.save();
                await mailerBreak(sensor.name, date, "From part B of the sensor, the data did not come, you should not change the data for this moment if you are satisfied with not 100% accuracy", sensor2.AGE);
            } else if (sensor1.AGE > 2 && sensor2.AGE < 2) {
                const aqi_sensor2 = aqiFromPM(sensor2.PM2_5Value);
                const aqi_average = aqi_sensor2
                const aqi_description = getAQIDescription(aqi_average);
                const aqi_message = getAQIMessage(aqi_average);
                const humidity = sensor1.humidity;
                const temp_f = sensor1.temp_f;
                sensor.dataSensor.push({
                aqi: aqi_average,
                description: aqi_description,
                message: aqi_message,
                temperature: temp_f,
                humidity,
                date,
                canEdit: true,
                edited: true,
                });
                await sensor.save();
                await mailerBreak(sensor.name, date, "From part A of the sensor, the data did not come, you should not change the data for this moment if you are satisfied with not 100% accuracy", sensor1.AGE);
            } else {
                sensor.lastRecord = date;
                sensor.dataSensor.push({
                aqi: 0,
                description: "Data didn't come",
                message: "Data from sensor didn't come",
                temperature: 0,
                humidity: 0,
                date,
                canEdit: true,
                })
                await sensor.save();
                await mailerBreak(sensor.name, date, "From part A and B of the sensor, the data did not come, you must change the data", sensor1.AGE, sensor2.AGE);
            }
            } catch (error) {
            console.error(error);
            }
        })
    }, { scheduled: true, timezone: "America/Regina" });
}