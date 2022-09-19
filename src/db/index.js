const mongoose = require("mongoose");
const config = require("../config");

mongoose.connect(config.db.uri).then(() => {
  console.log("Db is connected");
}).catch(err => {
  if (err) {
    console.log(err);
  }
});

const User = require("./models/User");
const Token = require("./models/Token");
const Sensor = require("./models/Sensor");
const Admin = require("./models/Admin");
const AdminToken = require("./models/AdminToken");
module.exports = {
  Admin,
  Sensor,
  User,
  Token,
  AdminToken
}