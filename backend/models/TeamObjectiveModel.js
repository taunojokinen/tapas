const mongoose = require("mongoose");

// Team schema
const teamSchema = new mongoose.Schema({
  owner: { type: String, required: true,},
  name: { type: String, required: true, }, type: { type: String, required: true,},
  mission: { type: String, required: false, },
  members: { type: [String], required: true, default: [],},
});

// Objective schema
const objectiveSchema = new mongoose.Schema({
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
      date: { type: String, required: true },
      team: { type: teamSchema, required: true }, // Embedded team schema
      objectives: { type: objectiveSchema, required: true }, // Single objective
      tasks: [taskSchema], // Array of tasks
      hindrances: [{ type: String }], // Array of strings
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
  );

  const TeamObjectives = mongoose.model("TeamObjectives", teamObjectivesSchema);
  module.exports = TeamObjectives;