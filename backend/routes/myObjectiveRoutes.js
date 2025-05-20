const express = require("express");
const MyObjectives = require("../models/MyObjectiveModel"); // Import the MyObjectives model
const router = express.Router();
const mongoose = require("mongoose"); 



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

    // Ensure each objective has a valid _id
    const validatedObjectives = objectives.map((objective) => {
      if (!objective._id || !mongoose.Types.ObjectId.isValid(objective._id)) {
        objective._id = new mongoose.Types.ObjectId(); // Generate a new ObjectId
      }
      return objective;
    });

    // Find an existing document for the user and update it, or create a new one if it doesn't exist
    const updatedObjectives = await MyObjectives.findOneAndUpdate(
      { user }, // Match by user
      {
        user,
        title,
        date,
        mission,
        objectives: validatedObjectives,
        tasks,
        hindrances,
        promoters,
      },
      { new: true, upsert: true } // Return the updated document and create it if it doesn't exist
    );

    res.status(200).json({
      success: true,
      message: "MyObjectives successfully created or updated",
      data: updatedObjectives,
    });
  } catch (error) {
    console.error("Error creating or updating MyObjectives:", error);
    res.status(500).json({ success: false, error: "Failed to create or update MyObjectives" });
  }
});
  router.patch("/:user", async (req, res) => {
    try {
      const { objectives } = req.body;
      console.log("Objectives:", objectives);
  
      // Validate objectives
      if (objectives) {
        req.body.objectives = objectives.map((objective) => {
          if (!objective._id || !mongoose.Types.ObjectId.isValid(objective._id)) {
            objective._id = new mongoose.Types.ObjectId(); // Generate a new ObjectId
          }
          return objective;
        });
      }
  
      // Update the document in the database
      const updatedDocument = await MyObjectives.findOneAndUpdate(
        { user: req.params.user }, // Match by user (fixed from username to user)
        { $set: req.body }, // Update the fields
        { new: true, runValidators: true } // Return the updated document
      );
  
      if (!updatedDocument) {
                console.log("User not found");
        return res.status(404).json({ error: "User not found" });

      }
  
      res.status(200).json({
        console: "Updated document",
        success: true,
        message: "MyObjectives successfully updated",
        data: updatedDocument,
      });
    } catch (error) {
      console.error("Error updating MyObjectives:", error);
      res.status(500).json({ error: "Failed to update MyObjectives" });
    }
  });
router.get("/all", async (req, res) => {
    try {
      // Fetch all documents from the database
      const objectives = await MyObjectives.find();
      res.status(200).json(objectives); // Respond with the retrieved documents
    } catch (error) {
      console.error("Error retrieving MyObjectives:", error);
      res.status(500).json({ error: "Failed to retrieve MyObjectives" });
    }
  });

  router.get("/", async (req, res) => {
    try {
      const { user } = req.query; // Get the user from query parameters
  
      if (!user) {
        return res.status(400).json({ error: "User query parameter is required" });
      }
  
      // Find the document matching the user
      let objectives = await MyObjectives.findOne({ user });
  
      // If no objectives are found for the user, fetch the default user's data
      if (!objectives) {
        const defaultObjectives = await MyObjectives.findOne({ user: "defaultuser" });
  
        if (!defaultObjectives) {
          return res.status(404).json({ error: "No default objectives found to create a new user" });
        }
  
        // Create a new document for the user using the default user's values
        objectives = new MyObjectives({
          ...defaultObjectives.toObject(),
          user, // Replace the "user" field with the original query parameter
          _id: undefined, // Remove the `_id` field to allow MongoDB to generate a new one
        });
  
        await objectives.save(); // Save the new document to the database
      }
  
      res.status(200).json(objectives);
    } catch (error) {
      console.error("Error retrieving or creating MyObjectives:", error);
      res.status(500).json({ error: "Failed to retrieve or create MyObjectives" });
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