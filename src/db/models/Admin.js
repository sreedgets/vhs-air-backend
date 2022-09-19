const { model, Schema } = require("mongoose");

const adminSchema = new Schema({
  login: {
    type: String,
    minlength: 5,
    maxlength: 32,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  ruleAdmin: {
    type: Boolean,
    default: true,
  },
  activationLink: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  recCount: {
    type: Number,
    default: 0,
  },
  blockedRec: {
    type: Boolean,
    default: false,
  },
})

module.exports = model("admin", adminSchema);