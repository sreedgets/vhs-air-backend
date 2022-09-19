const adminController = require("../controllers/adminController");
const sensorController = require("../controllers/sensorController");
const validateMiddleware = require("../middlewares/validationMiddleware");
const adminCheckMiddleware = require("../middlewares/adminCheckMiddleware");
const {
  UserValidateSchema,
  EditValidateSchema,
  AdminValidateSchema,
  EditAdminValidateSchema,
  EmailValidation,
  SensorEditArrayDataValidationSchema,
  ExcelDateValidation
} = require("../validators");
const adminEmailCodeMiddleware = require("../middlewares/adminEmailCodeMiddleware");
const uploadController = require("../../uploads/sendFile");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");
module.exports = (app) => {
  //if have not owner app.post("/admin/createOwner", validateMiddleware(AdminValidateSchema), adminController.createOwner);

  /*app.put("/admin/editUser/:id",
   adminAuthMiddleware,
   adminCheckMiddleware,
   validateMiddleware(EditValidateSchema),
   adminController.editUser);*/

  app.post("/admin/weblogin", adminController.loginWeb);

  app.post("/admin/logout",
    adminAuthMiddleware,
    adminController.logoutWeb);
  app.post("/admin/refreshToken", adminController.refreshToken)

  app.post("/admin/createUser",
    adminAuthMiddleware,
    adminCheckMiddleware,
    validateMiddleware(UserValidateSchema),
    adminController.createUser);

  app.post("/admin/createSensor",
    adminAuthMiddleware,
    adminCheckMiddleware,
    adminController.createSensor);


  app.get("/admin/getActivationLink",
    validateMiddleware(EmailValidation),
    adminEmailCodeMiddleware,
    adminController.getCode);

  app.put("/admin/changePasswordEmail/:code",
    adminAuthMiddleware,
    adminCheckMiddleware,
    validateMiddleware(EditAdminValidateSchema),
    adminController.editPasswordEmail)

  app.put("/admin/changePasswordProfile",
    validateMiddleware(EditAdminValidateSchema),
    adminController.editPassword);

  app.delete("/admin/removeUser/:id",
    adminAuthMiddleware,
    adminCheckMiddleware,
    adminController.removeUser);

  app.post("/admin/getSensors", adminAuthMiddleware, adminController.getSensors);

  app.get("/admin/users",
    adminAuthMiddleware,
    adminCheckMiddleware,
    adminController.getUsers);

  app.get("/admin/profile", adminAuthMiddleware, adminController.getProfile);

  app.post("/admin/report",
    adminAuthMiddleware,
    validateMiddleware(ExcelDateValidation),
    uploadController.sendFile);

  app.put("/admin/editSensor",
    adminAuthMiddleware,
    validateMiddleware(SensorEditArrayDataValidationSchema),
    sensorController.editSensor)
}