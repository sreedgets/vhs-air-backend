const { model, Schema } = require("mongoose");

const userSchema = new Schema({
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
  }
})

module.exports = model("user", userSchema);