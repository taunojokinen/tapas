const mongoose = require("mongoose");

// Task schema
const TaskSchema = new mongoose.Schema({
  nimi: { type: String, required: true },
  mittari: { type: String, required: true },
  seuranta: { type: String, required: true },
});

// Objective schema
const ObjectiveSchema = new mongoose.Schema({
  nimi: { type: String, required: true },
  mittari: { type: String, required: true },
  seuranta: { type: String, required: true },
  tasks: { type: [TaskSchema], default: [] },
  hindrances: { type: String, required: true },
  promoters: { type: String, required: true },
});

// Team schema = main schema
const TeamSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Explicitly define _id
  owner: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  mission: { type: String, required: false },
  members: { type: [String], required: true, default: [] },
  teamObjectives: { type: [ObjectiveSchema], required: true, default: [] },
});

const TeamObjectives = mongoose.model("TeamObjectives", TeamSchema);
module.exports = TeamObjectives;