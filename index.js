const express = require("express");
const app = express();
const config = require("./src/config");
const ErrorHandler = require("./src/errors/errorHandler");
const uploadFile = require("./src/api/sensorDB");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use(
  express.static(path.resolve(__dirname, '../Sensor-web/build')),
);

uploadFile();
app.use(express.static(path.join(__dirname)));
app.listen(config.app.port, () => {
  console.log(`Server start on port: ${config.app.port}`);
})

require("./src/routes")(app);
app.use(ErrorHandler);

app.get('*', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, '../vhs-air-frontend/build', 'index.html'),
  );
});