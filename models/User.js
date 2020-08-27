const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { Type: String },
  Email: { Type: String },
  Password: { Type: String },
  avatar: { Type: String },
  date: { type: Date, default: Date.now },
});
module.exports = User = mongoose.model("users", UserSchema);
