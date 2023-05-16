const ApiError = require("../errors/apiError");
const adminServices = require("../services/adminServices");
const sensorServices = require("../services/sensorServices");
const tokenServices = require("../services/tokenServices");
const { Admin } = require("../db");
const axios = require("axios");
const config = require("../config");
const generateAdminAccessToken = require("../helpers/generateAdminAccessToken");
const getRefreshToken = require("../helpers/getRefreshToken");
const verifyRefreshAdminToken = require("../helpers/verifyRefreshAdminToken");

module.exports = {
  loginWeb: async (req, res, next) => {
    try {
      const { login, password } = req.body;
      const { refreshToken, adminId } = await adminServices.loginOwner(login, password);
      const accessToken = generateAdminAccessToken(adminId);
      res
        .cookie("refreshToken", `Bearer ${refreshToken}`,
          {
            maxAge: config.token.cookieTime,
          })
        .json({
          loginOwnSuccess: true,
          accessToken
        });
    } catch (err) {
      next(err);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = getRefreshToken(req);
      const accessToken = await tokenServices.refreshAdminToken(refreshToken);
      res.json({ refreshAccess: true, accessToken });
    } catch (err) {
      next(err);
    }
  },

  logoutWeb: async (req, res, next) => {
    try {
      const { admin } = req;
      const deleted = await tokenServices.deleteAdminToken(admin._id);
      if (!deleted) {
        throw ApiError.ServerError(false, "logout error", "logoutWeb", true);
      }
      res.clearCookie("refreshToken").json({ logOutSuccess: deleted });
    } catch (err) {
      next(err);
    }

  },
  getCode: async (req, res, next) => {
    try {
      const { email } = req.body;
      const admin = Admin.findOne({ email });
      if (admin) {
        await adminServices.mailerLink(email);
        res.json({ message: "Code send on email", sendCode: true })
      } else {
        res.status(400).json({ message: "Email not currect", sendCode: false });
      }
    } catch (err) {
      res.status(500).json({ message: "Repeat send code", sendCode: false });
    }
  },
  editPasswordEmail: async (req, res, next) => {
    try {
      const { code } = req.params;
      const { validate } = req;
      const { message, edited } = await adminServices.editAdminPasswordEmail(code, validate.password);
      res.json({ message, editPassword: edited });
    } catch (err) {
      next(err);
    }
  },
  editPassword: async (req, res, next) => {
    try {
      const { _id } = req.admin;
      const { oldPassword } = req.body;
      const { validate } = req;
      const { message, edited } = await adminServices.editAdminPassword(_id, oldPassword, validate.password)
      if (edited) {
        res.json({ message, edited });
      } else {
        res.status(400).json({ message: "Edit password error", edited: false });
      }
    } catch (err) {
      next(err);
    }
  },
  createUser: async (req, res, next) => {
    try {
      const { validate } = req;
      const { user } = await adminServices.createUser(validate);
      if (user) {
        res.json({ user, message: "User-Admin created", created: true });
      } else {
        res.json({ message: "User-Admin not created", created: false });
      }
    } catch (err) {
      next(err);
    }
  },
  removeUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleteObject = await adminServices.deleteUser(id);
      if (deleteObject.isDeleted) {
        res.json({ idUserDeleted: id, isDeleted: true });
      } else {
        throw ApiError.ServerError(true, "Error delete user", "remove user", true);
      }
    } catch (err) {
      next(err);
    }
  },
  createOwner: async (req, res, next) => {
    try {
      const { validate } = req;
      const id = await adminServices.createOwner(validate);
      if (!id) {
        throw ApiError.ServerError(true, "Error create Owner", "create owner", true);
      } else {
        res.json({ id, isCreated: true });
      }
    } catch (err) {
      next(err);
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const { page, size } = req.query;
      const users = await adminServices.getUsers(page, size);
      if (!users || !users.length) {
        res.json({ message: "Users list clear", success: false });
      } else {
        res.json({ users, success: true, page, size });
      }
    } catch (err) {
      next(err);
    }
  },

  /*editUser: async (req, res, next) => {
    try {
      const { validate } = req;
      const { id } = req.params;
      if (!id) {
        throw ApiError.BadRequest(true, "not transferred user id", "edit user", null);
      }
      const updateUser = await adminServices.editUser(id, validate);
      res.json(updateUser);
    } catch (err) {
      next(err);
    }
  },*/
  createSensor: async (req, res, next) => {
    try {
      const { key, show } = req.body;
      let response;
      if (key && show) {
        response = await axios.get(`https://www.purpleair.com/json?key=${key}&show=${show}`);
      } else {
        throw ApiError.BadRequest(true, "key or show not sended", "create sensor", true);
      }
      if (!response) {
        throw ApiError.BadRequest(true, "Sensor not found", "create sensor", true);
      }
      const [sensor1, sensor2] = response.data.results;
      const sensor = await sensorServices.createSensor(sensor1.Label, key, show);
      if (!sensor) {
        throw ApiError.ServerError(true, "Sensor not created", "create sensor", true)
      } else {
        res.json({ message: "Sensor created!", sensorId: sensor._id, createdSensor: true });
      }
    } catch (err) {
      next(err);
    }
  },
  getSensors: async (req, res, next) => {
    try {
      let { page, size } = req.query;
      let { from, to } = req.body;
      console.log(from, to);
      if (!from) {
        from = new Date(0);
      }
      if (!to) {
        to = new Date();
        to.setHours(23, 59, 0, 0);
      }
      if (!page) {
        page = 1;
      }
      if (!size) {
        size = 5;
      }

      const sensors = await sensorServices.getSensors(from, to, page, size);
      if (!sensors) {
        res.json({ sensors, successGet: false, page, size });
      } else {
        res.json({ sensors, successGet: true, page, size });
      }
    } catch (err) {
      next(err);
    }
  },
  getProfile: async (req, res, next) => {
    try {
      const { _id } = req.admin
      const admin = await adminServices.getProfile(_id);
      if (!admin) {
        throw ApiError.ServerError(true, "Something was wrong repeat check profile", "get Profile", true)
      } else {
        res.json({ profile: admin, profileGet: true });
      }
    } catch (err) {
      next(err);
    }
  },
}