const express = require("express");
const mongoose = require("mongoose");
const TeamObjectives = require("../models/TeamObjectiveModel"); // Import the MyObjectives model
const router = express.Router();

// POST route to create a new team objective
router.post("/create", async (req, res) => {
  try {
    const { owner, name, type, mission, members, teamObjectives } = req.body;

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

// PUT route to update a team objective or create if not exists (upsert)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTeamObjective = await TeamObjectives.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true, upsert: true } // upsert: true creates if not exists
    );

    res.status(200).json(updatedTeamObjective);
  } catch (error) {
    console.error("Error updating or creating team objective:", error);
    res
      .status(500)
      .json({ message: "Failed to update or create team objective", error });
  }
});

router.put("/objective/:objectiveId", async (req, res) => {
  try {
    const { objectiveId } = req.params;
    const updateData = req.body;

    // Find the team containing the objective
    const team = await TeamObjectives.findOne({
      "teamObjectives._id": objectiveId,
    });
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Find the objective and update its fields
    const objective = team.teamObjectives.id(objectiveId);
    if (!objective)
      return res.status(404).json({ message: "Objective not found" });

    Object.assign(objective, updateData);

    await team.save();
    res.status(200).json(objective);
  } catch (error) {
    console.error("Error updating team objective:", error);
    res.status(500).json({ message: "Failed to update team objective", error });
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

// GET route to fetch team objectives by user
router.get("/user/:user", async (req, res) => {
  try {
    const { user } = req.params;
    console.log("Fetching team objectives for user:", user);

    // Find all team objectives where the user is the owner or a member
    const teamObjectives = await TeamObjectives.find({
      $or: [{ owner: user }, { members: user }],
    });
    console.log("Found team objectives:", teamObjectives);

    // Respond with the matching team objectives
    res.status(200).json(teamObjectives);
  } catch (error) {
    console.log("Mirja kävi täällä");
    console.error("Error fetching team objectives for user:", error);
    console.error(error.stack); // Log the error stack for more details
    res
      .status(500)
      .json({ message: "Failed to fetch team objectives for user", error });
  }
});

// DELETE route to delete all team objectives
router.delete("/all", async (req, res) => {
  try {
    const result = await TeamObjectives.deleteMany(); // Deletes all documents in the collection
    res
      .status(200)
      .json({
        message: "All team objectives deleted.",
        deletedCount: result.deletedCount,
      });
  } catch (error) {
    console.error("Error deleting team objectives:", error);
    res
      .status(500)
      .json({ message: "Failed to delete team objectives", error });
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
