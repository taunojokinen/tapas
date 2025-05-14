const express = require("express");
const MyObjectives = require("../models/MyObjectiveModel"); // Import the MyObjectives model
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

  router.patch("/:user", async (req, res) => {
    try {
      const { user } = req.params; // Get the user from the route parameter
      const updateData = req.body; // Get the fields to update from the request body
  
      // Find the document by user and update it with the provided fields
      const updatedObjectives = await MyObjectives.findOneAndUpdate(
        { user }, // Match by user
        { $set: updateData }, // Update only the provided fields
        { new: true } // Return the updated document
      );
  
      if (updatedObjectives) {
        res.status(200).json({ message: "MyObjectives successfully updated", updatedObjectives });
      } else {
        res.status(404).json({ error: "MyObjectives not found for the specified user" });
      }
    } catch (error) {
      console.error("Error updating MyObjectives:", error);
      res.status(500).json({ error: "Failed to update MyObjectives" });
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