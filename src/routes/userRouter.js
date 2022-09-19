const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");
const contactUsSchema = require("../validators/contactUs")
module.exports = (app) => {

  app.post("/user/login", userController.logination);//is working
  app.post("/user/contactUs", validationMiddleware(contactUsSchema), userController.contactUs);//is working
  app.post("/user/logout", authMiddleware, userController.logOut);
  //app.get("/profile", userController.getProfile);
  
}