const { model, Schema } = require("mongoose");

const tokenSchema = new Schema({
  adminId: {
    type: Schema.Types.ObjectId,
    ref: "admins",
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
})

module.exports = model("adminToken", tokenSchema);