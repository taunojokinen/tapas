const express = require("express");
const mongoose = require("mongoose");
const TeamObjectives = require("../models/TeamObjectiveModel"); // Import the MyObjectives model
const router = express.Router();

// POST route to create a new team objective
router.post("/create", async (req, res) => {
  try {
    const {
      owner,
      name,
      type,
      mission,
      members,
      teamObjectives,
    } = req.body;

    // Create a new team document
    const newTeam = new TeamObjectives({
      owner,
      name,
      type,
      mission,
      members,
      teamObjectives,
    });

    // Save the team document to the database
    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    console.error("Error creating team objective:", error);
    res.status(500).json({ error: "Failed to create team objective" });
  }
});



router.post("/check", async (req, res) => {
  console.log("Checking team objective...", JSON.stringify(req.body));
  try {
    const { teamId, objectiveId, user } = req.body;

    // Validate input
    if (!teamId || !objectiveId || !user) {
      return res.status(400).json({ message: "Team ID, Objective ID, and User are required." });
    }

    // Validate Team ID format
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid Team ID format." });
    }
    const teamObjectId = new mongoose.Types.ObjectId(teamId);

    // Find existing team objective
    let teamObjective = await TeamObjectives.findOne({ team: teamObjectId, "objectives._id": objectiveId })
      .populate("team"); // Populate the team field

    if (!teamObjective) {
      console.log("No matching team objective found. Creating a new one...");
      teamObjective = new TeamObjectives({
        user,
        team: teamObjectId,
        objectives: [
          {
            _id: objectiveId,
            nimi: "Default Name",
            mittari: "Default Metric",
            seuranta: "Default Tracking",
          },
        ],
        tasks: [],
        hindrances: [],
        date: new Date(),
      });
      console.log("Saving team objective:", teamObjective);
      await teamObjective.save();
      return res.status(201).json({ message: "Team objective created.", teamObjective });
    }

    // Return the found team objective
    res.status(200).json({ message: "Team objective found.", teamObjective });
  } catch (error) {
    console.error("Error in /check route:", error.message, error.stack);
    res.status(500).json({ message: "Failed to check or create team objective.", error });
  }
});
// GET route to fetch all team objectives
router.get("/all", async (req, res) => {
  try {
    const teamObjectives = await TeamObjectives.find(); // Fetch all documents in the collection
    res.status(200).json(teamObjectives); // Respond with all team objectives
  } catch (error) {
    console.error("Error fetching team objectives:", error);
    res.status(500).json({ message: "Failed to fetch team objectives", error });
  }
});

// DELETE route to delete all team objectives
router.delete("/all", async (req, res) => {
  try {
    const result = await TeamObjectives.deleteMany(); // Deletes all documents in the collection
    res.status(200).json({ message: "All team objectives deleted.", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error deleting team objectives:", error);
    res.status(500).json({ message: "Failed to delete team objectives", error });
  }
});

// DELETE route to delete a specific team objective by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TeamObjectives.findByIdAndDelete(id); // Deletes the document with the specified ID
    if (!result) {
      return res.status(404).json({ message: "Team objective not found." });
    }
    res.status(200).json({ message: "Team objective deleted.", result });
  } catch (error) {
    console.error("Error deleting team objective:", error);
    res.status(500).json({ message: "Failed to delete team objective", error });
  }
});
module.exports = router;