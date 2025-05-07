const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: false,
  },
  members: {
    type: [String], // Array of strings
    required: true,
    default: [],
  },
});

module.exports = mongoose.model("Team", teamSchema);