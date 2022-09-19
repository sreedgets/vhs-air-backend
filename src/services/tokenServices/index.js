const jwt = require("jsonwebtoken");
const { Token, AdminToken } = require("../../db");
const ApiError = require("../../errors/apiError");
const generateToken = require("../../helpers/generateToken");
const generateRefreshToken = require("../../helpers/generateAdminRefreshToken");
const config = require("../../config");
const generateAdminRefreshToken = require("../../helpers/generateAdminRefreshToken");
const verifyRefreshAdminToken = require("../../helpers/verifyRefreshAdminToken");
const generateAdminAccessToken = require("../../helpers/generateAdminAccessToken");
module.exports = {
  saveAndGenerateAdminToken: async (adminId) => {
    let candidateToken = await AdminToken.findOne({ adminId });
    if (!candidateToken) {
      const refreshToken = generateAdminRefreshToken(adminId);
      const adminToken = await AdminToken.create({
        adminId,
        refreshToken
      })
      return refreshToken;
    } else {
      const refreshToken = generateRefreshToken(adminId);
      candidateToken.refreshToken = refreshToken;
      await candidateToken.save();
      return candidateToken.refreshToken;
    }
  },
  saveAndGenerateToken: async (userId) => {
    const candidateToken = await Token.findOne({ userId });

    if (candidateToken) {
      return null;
    }
    const token = generateToken(userId);
    const userToken = await Token.create({
      userId,
      token
    });
    return userToken.token;
  },

  getUserIdByToken: async (token) => {
    const userToken = await Token.findOne({ token });
    if (!userToken) {
      throw ApiError.ServerError(true, "Something was wrong, contact with admin service for repeat registration", "Get user id by token", true);
    }
    return userToken.userId;
  },
  getTokenByUserId: async (userId) => {
    const token = generateToken(userId);
    let candidate;
    try {
      candidate = await Token.findOne({ userId });
    } catch (err) {
      const tokenUser = await Token.create({ userId, token })
      return tokenUser.token;
    }
    if (candidate) {
      candidate.token = generateToken(userId);
      await candidate.save();
      return candidate.token;
    } else {
      const tokenUser = await Token.create({ userId, token })
      return tokenUser.token;
    }

  },
  validationToken: async (token) => {
    const userToken = jwt.verify(token, config.token.key);
    if (userToken) {
      return true;
    }
    return false;
  },
  deleteToken: async (userId) => {
    try {
      await Token.findOneAndRemove({ userId });
      return true;
    } catch (err) {
      return false;
    }
  },
  deleteAdminToken: async (adminId) => {
    try {
      await AdminToken.findOneAndRemove({ adminId });
      return true;
    } catch (err) {
      return false;
    }
  },
  refreshAdminToken: async (refreshToken) => {
    try {
      const payload = verifyRefreshAdminToken(refreshToken);
    } catch (err) {
      throw ApiError.Unauthorized();
    }
    let adminUser = await AdminToken.findOne({ refreshToken });
    if (!adminUser) {
      throw ApiError.Unauthorized();
    }
    const token = generateAdminAccessToken(adminUser.adminId)
    console.log(token);
    return token;
  }
}