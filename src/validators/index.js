const UserValidateSchema = require("./validationUser");
const EditValidateSchema = require("./editValidation");
const AdminValidateSchema = require("./validationAdmin");
const EditAdminValidateSchema = require("./editAdmin");
const ContactUsValidateSchema = require("./contactUs");
const SensorEditArrayDataValidationSchema = require("./validationEditArraySensorData")
const SensorEditDataValidation = require("./validationEditSensor");
const EmailValidation = require("./emailValidation");
const ExcelDateValidation = require("./excelDateValidation");
module.exports = {
  ContactUsValidateSchema,
  EditAdminValidateSchema,
  UserValidateSchema,
  EditValidateSchema,
  AdminValidateSchema,
  SensorEditArrayDataValidationSchema,
  SensorEditDataValidation,
  EmailValidation,
  ExcelDateValidation
}