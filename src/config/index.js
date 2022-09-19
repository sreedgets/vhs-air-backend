require("dotenv").config();

/*
COOKIE_TIME=86400000
ADMIN_REFESH_TOKEN_LIFE=86400s
ADMIN_TOKEN_LIFE=300s

*/
module.exports = {
  app: {
    port: process.env.PORT,
  },
  db: {
    uri: process.env.DB_CONNECT,
  },
  token: {
    key: process.env.TOKEN_KEY,
    refreshKey: process.env.REFRESH_TOKEN_KEY,
    cookieTime: process.env.COOKIE_TIME,
    refreshLife: process.env.ADMIN_REFRESH_TOKEN_LIFE,
    accessLife: process.env.ADMIN_TOKEN_LIFE,
    tokenAppTime: process.env.APP_TOKEN_LIFE,
  },
  contactUs: {
    email: process.env.CONTACT_US
  },
  mailer: {
    login: process.env.LOGIN_MAILER,
    pass: process.env.PASSWORD_MAILER,
  }
}