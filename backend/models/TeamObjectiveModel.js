const mongoose = require("mongoose");

// Team schema (if embedded, otherwise use a reference)
const teamSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Explicitly define _id
  owner: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  mission: { type: String, required: false },
  members: { type: [String], required: true, default: [] },
});

// Objective schema
const objectiveSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Explicitly define _id
  nimi: { type: String, required: true },
  mittari: { type: String, required: true },
  seuranta: { type: String, required: true },
});

// Task schema
const taskSchema = new mongoose.Schema({
  nimi: { type: String, required: true },
  mittari: { type: String, required: true },
  seuranta: { type: String, required: true },
});

// Main schema
const teamObjectivesSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    date: { type: Date, required: true }, // Use Date type
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true }, // Reference to Team collection
    objectives: [objectiveSchema], // Array of objectives
    tasks: [taskSchema], // Array of tasks
    hindrances: { type: [String], default: [] }, // Array of strings with default value
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const TeamObjectives = mongoose.model("TeamObjectives", teamObjectivesSchema);
module.exports = TeamObjectives;