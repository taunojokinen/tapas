const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['admin', 'manager', 'user'],  // 🔹 Roolit: admin, manager, user
    default: 'user',
  },
  manager:  { type: String },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
