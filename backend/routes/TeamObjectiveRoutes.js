
const express = require("express");
const TeamObjectives = require("../models/TeamObjectiveModel"); // Import the MyObjectives model
const router = express.Router();

// POST route to create a new team objective
router.post("/create", async (req, res) => {
  try {
    const {
      user,
      date,
      team,
      objectives,
      tasks,
      hindrances,
    } = req.body;

    // Create a new TeamObjective document
    const newTeamObjective = new TeamObjectives({
      user,
      date,
      team,
      objectives,
      tasks,
      hindrances,
    });

    // Save the document to the database
    const savedTeamObjective = await newTeamObjective.save();
    res.status(201).json(savedTeamObjective); // Respond with the created document
  } catch (error) {
    res.status(500).json({ message: "Failed to create team objective", error });
  }
});

// PATCH route to update a specific team objective by _id
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find and update the document by _id
    const updatedTeamObjective = await TeamObjectives.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true } // Return the updated document and validate the updates
    );

    if (!updatedTeamObjective) {
      return res.status(404).json({ message: "Team objective not found" });
    }

    res.status(200).json({ message: "Team objective updated successfully", updatedTeamObjective });
  } catch (error) {
    res.status(500).json({ message: "Failed to update team objective", error });
  }
});



// GET route to fetch all team objectives
router.get("/all", async (req, res) => {
  try {
    const teamObjectives = await TeamObjectives.find();
    res.status(200).json(teamObjectives);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team objectives", error });
  }
});

router.delete("/all", async (req, res) => {
  try {
    const result = await TeamObjectives.deleteMany(); // Deletes all documents in the collection
    res.status(200).json({ message: "All team objectives deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete team objectives", error });
  }
});

// DELETE route to delete a specific team objective by _id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the document by _id
    const result = await TeamObjectives.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Team objective not found" });
    }

    res.status(200).json({ message: "Team objective deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete team objective", error });
  }
});

module.exports = router;

module.exports = router;