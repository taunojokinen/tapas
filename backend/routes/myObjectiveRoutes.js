const express = require("express");
const MyObjectives = require("../models/MyObjectiveModel"); // Import the MyObjectives model
const checkRole = require("../middleware/checkRole"); // Middleware for role checking
const router = express.Router();

// POST route to create a new MyObjectives document
router.post("/", async (req, res) => {
    try {
      const {
        user,
        title,
        date,
        mission,
        objectives,
        tasks,
        hindrances,
        promoters,
      } = req.body;
  
      // Find an existing document for the user and update it, or create a new one if it doesn't exist
      const updatedObjectives = await MyObjectives.findOneAndUpdate(
        { user }, // Match by user
        {
          user,
          title,
          date,
          mission,
          objectives,
          tasks,
          hindrances,
          promoters,
        },
        { new: true, upsert: true } // Return the updated document and create it if it doesn't exist
      );
  
      res.status(200).json(updatedObjectives); // Respond with the updated document
    } catch (error) {
      console.error("Error creating or updating MyObjectives:", error);
      res.status(500).json({ error: "Failed to create or update MyObjectives" });
    }
  });

router.get("/", async (req, res) => {
    try {
      // Fetch all documents from the database
      const objectives = await MyObjectives.find();
      res.status(200).json(objectives); // Respond with the retrieved documents
    } catch (error) {
      console.error("Error retrieving MyObjectives:", error);
      res.status(500).json({ error: "Failed to retrieve MyObjectives" });
    }
  });
  router.delete("/:user", async (req, res) => {
    try {
      const { user } = req.params;
  
      // Find and delete the document matching the user
      const deletedObjectives = await MyObjectives.findOneAndDelete({ user });
  
      if (deletedObjectives) {
        res.status(200).json({ message: "MyObjectives successfully deleted", deletedObjectives });
      } else {
        res.status(404).json({ error: "MyObjectives not found for the specified user" });
      }
    } catch (error) {
      console.error("Error deleting MyObjectives:", error);
      res.status(500).json({ error: "Failed to delete MyObjectives" });
    }
  });
  
module.exports = router;