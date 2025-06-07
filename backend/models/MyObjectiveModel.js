const mongoose = require("mongoose");

// Define sub-schemas for objectives and tasks
const objectiveSchema = new mongoose.Schema({
  nimi: { type: String, required: true },
  mittari: { type: String, required: true },
  seuranta: { type: String, required: true },
});

const taskSchema = new mongoose.Schema({
  nimi: { type: String, required: true },
  mittari: { type: String, required: true },
  seuranta: { type: String, required: true },
});

const missionSchema = new mongoose.Schema(
  {
    img: { type: String, required: false },
    otsikko: { type: String, required: true },
    kuvaus: { type: String, required: true },
  },
  { _id: false }
);

// Define the main schema for MyObjectivesJson
const myObjectivesSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    mission: { type: missionSchema, required: true },
    objectives: [objectiveSchema], // Array of objectives
    tasks: [taskSchema], // Array of tasks
    hindrances: [{ type: String }], // Array of strings
    promoters: [{ type: String }], // Array of strings
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const MyObjectives = mongoose.model("MyObjectives", myObjectivesSchema);
module.exports = MyObjectives;
