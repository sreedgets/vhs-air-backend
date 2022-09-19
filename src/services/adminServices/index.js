const ApiError = require("../../errors/apiError");
const { User, Admin, AdminToken } = require("../../db");
const bCrypt = require("bcrypt");
const tokenService = require("../tokenServices");
const mailer = require("../../tools/mailerTools");
const sensorServices = require("../sensorServices");
const Excel = require("exceljs")


module.exports = {
  loginOwner: async (login, password) => {
    if (!login | !password) {
      throw ApiError.BadRequest(true, "Not input password or login", "loginOwner", true);
    }
    let admin = await Admin.findOne({ login });
    if (!admin) {
      admin = await User.findOne({ login });
      if (!admin) {
        throw ApiError.BadRequest(true, "Not currect password or login", "loginOwner", true);
      }
    }
    const isEquals = await bCrypt.compare(password, admin.password);
    if (!isEquals) {
      throw ApiError.BadRequest(true, "Not currect password or login", "loginOwner", true);
    }
    if (admin.ruleAdmin) {
      admin.recCount = 0;
      admin.blockedRec = false;
      await admin.save();
    }
    const refreshToken = await tokenService.saveAndGenerateAdminToken(admin._id);
    return { refreshToken, adminId: admin._id };
  },
  createUser: async ({ login, password }) => {
    const candidate = await User.findOne({ login });
    if (candidate) {
      throw ApiError.BadRequest(true, "A user with this login has already been created", "Admin Create User", true);
    }
    const hashPassword = await bCrypt.hash(password, 10);
    const user = await User.create({
      login,
      password: hashPassword,
    });
    const token = await tokenService.saveAndGenerateToken(user._id);
    return {
      user: {
        id: user._id,
        login: user.login,
      }
    };
  },
  createOwner: async ({ login, password, ruleAdmin, email }) => {
    const candidate = await User.findOne({ login });
    if (candidate) {
      throw ApiError.BadRequest(true, "A user with this login has already been created", "Admin Create User", true);
    }
    const adminCandidate = await Admin.findOne({ login });
    if (adminCandidate) {
      throw ApiError.BadRequest(true, "A user with this login has already been created", "Admin Create User", true);
    }
    const hashPassword = await bCrypt.hash(password, 10);
    const owner = await Admin.create({
      ruleAdmin,
      login,
      password: hashPassword,
      email,
    });

    return owner._id;
  },
  editAdminPasswordEmail: async (code, password) => {
    let admin = await Admin.findOne({ activationLink: code });
    if (admin.blockedRec) {
      throw ApiError.Forbidden("Password recovery by email");
    } else {
      if (!admin.activationLink) {
        return { message: "Can`t update admin, because not send activation code", edited: false };
      }
      if (admin.activationLink === code) {
        hashPassword = await bCrypt.hash(password, 10);
        const code = `${Math.random() * 1000000}`.split(".")[0];
        admin.password = hashPassword;
        admin.activationLink = code;
        await admin.save();
      } else {
        if (admin.recCount === 3 || admin.recCount > 3) {
          admin.blockedRec = true;
          admin.recCount = 0;
        } else {
          admin.recCount += 1;
        }
        await admin.save();
        return { message: "Code not currect", edited: false };
      }
      return { message: "Edit success", edited: true };
    }
  },
  editAdminPassword: async (id, oldPassword, newPassword) => {
    let admin = await Admin.findById(id);
    const isEquals = await bCrypt.compare(oldPassword, admin.password);
    if (!isEquals) {
      return { edited: false, message: "Old password not currect" };
    }
    const hashPassword = await bCrypt.hash(newPassword, 10);
    admin.password = hashPassword;
    await admin.save();
    return { edited: true, message: "Password edit confirm" };
  },
  deleteUser: async (userId) => {
    let candidate;
    try {
      candidate = await User.findById(userId);
    } catch (err) {
      candidate = null
    }
    const deleteToken = await tokenService.deleteToken(userId);
    if (!deleteToken && !candidate) {
      throw ApiError.BadRequest(true, "Not found user by id", "remove user", true);
    } else if (candidate) {
      try {
        await User.findByIdAndRemove(userId);
        return { isDeleted: true };
      } catch (err) {
        return { err, isDeleted: false };
      }
    } else {
      throw ApiError.BadRequest(true, "User not found by id", "remove user", true);
    }

  },

  getUsers: async (page, size) => {

    if (!page && !size) {
      const users = await User.find().select("login");
      return users;
    }
    page == 0 ? 1 : page;
    const limit = parseInt(size);
    const skip = (page - 1) * size;
    const users = await User.find().limit(limit).skip(skip).select("login");
    return users;
  },

  mailerLink: async (email) => {
    const code = `${Math.random() * 1000000}`.split(".")[0];
    const admin = await Admin.findOne({ email });
    admin.activationLink = code;
    await admin.save();
    mailer({
      to: admin.email,
      subject: "This activatior for edit password or login",
      html: `<div>
        <h1>ACTIVATION CODE: ${code}<h1/>
      <div/>`,
    })
    return true;
  },
  getProfile: async (id) => {
    let admin = await Admin.findById(id).select("ruleAdmin email login");
    if (!admin) {
      admin = await User.findById(id).select("ruleAdmin email login");
      if (!admin) {
        throw ApiError.Unauthorized();
      }
    }
    return admin;
  },
  reports: async (dateFrom, dateTo) => {
    if (!dateFrom) {
      dateFrom = new Date(0);
    }
    if (!dateTo) {
      dateTo = new Date();
    }

    const sensors = await sensorServices.getFullSensorsData();
    let workbook = new Excel.Workbook();
    sensors.forEach(async (sensor) => {
      let worksheet = workbook.addWorksheet(sensor.name);
      let i = 0;
      sensor.dataSensor.forEach((d) => {
        worksheet.columns = [
          {
            header: "DATE",
            key: "date"
          },
          {
            header: "AQI",
            key: "aqi",
          },
          {
            header: "TEMPERATURE",
            key: "temperature",
          },
          {
            header: "HUMIDITY",
            key: "humidity",
          }
        ]

        if (new Date(d.date) >= new Date(dateFrom) && new Date(d.date) <= new Date(dateTo)) {
          i++;
          worksheet.addRow({
            date: d.date,
            aqi: d.aqi,
            temperature: d.temperature,
            humidity: d.humidity,
          })
        }
      })
      if (i === 0) {
        throw ApiError.BadRequest(true, "Not found data by date", "reports excel", true);
      }
    });
    await workbook.xlsx.writeFile("./uploads/report/reports.xlsx");
    return true;
  }
}