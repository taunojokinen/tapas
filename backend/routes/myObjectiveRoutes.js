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

    // Create a new MyObjectives document
    const newObjectives = new MyObjectives({
      user,
      title,
      date,
      mission,
      objectives,
      tasks,
      hindrances,
      promoters,
    });

    // Save the document to the database
    const savedObjectives = await newObjectives.save();
    res.status(201).json(savedObjectives); // Respond with the saved document
  } catch (error) {
    console.error("Error creating MyObjectives:", error);
    res.status(500).json({ error: "Failed to create MyObjectives" });
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

module.exports = router;