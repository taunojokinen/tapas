const express = require("express");
const Values = require("../models/Values"); // Tuodaan Values-malli
const checkRole = require("../middleware/checkRole")
const router = express.Router();

// Route to create multiple values
router.post("/", async (req, res) => {
    //console.log("Received request to create userlist:"); // Log the request body for debugging
    const { values } = req.body; //  // Extract the `values` array from the request body
    console.log("Received values:",values); // Log the received users for debugging
  
    if (!Array.isArray(values)) {
      return res.status(400).json({ message: "Invalid data format. Expected an array of values." });
    }
  
    try {
      // Save all users to the database
      const savedValues = await Values.insertMany(values);
      res.status(201).json({ message: "values saved successfully!", savedValues });
    } catch (error) {
      console.error("Error saving values:", error);
      res.status(500).json({ message: "Failed to save values", error });
    }
  });

  // Replace all values with new ones
router.put("/", async (req, res) => {
    const { values } = req.body;
  
    if (!Array.isArray(values)) {
      return res.status(400).json({ message: "Invalid data format. Expected an array of values." });
    }
  
    try {
      // Delete all existing values
      await Values.deleteMany({});
  
      // Insert the new values
      const savedValues = await Values.insertMany(values);
  
      res.status(200).json({ message: "Values replaced successfully!", savedValues });
    } catch (error) {
      console.error("Error replacing values:", error);
      res.status(500).json({ message: "Failed to replace values", error });
    }
  });

  router.get("/", async (req, res) => {
      try {
        const values = await Values.find(); // Fetch all users from the database
        
        if (values.length === 0) {
          return res.status(404).json({ message: "No values found." }); // Return 404 if no users exist
      }
      res.status(200).json(values); // Return the users as JSON
      } catch (error) {
        console.error("Error fetching values:", error);
        res.status(500).json({ message: "Error fetching values", error });
      }
    });
  
  // Delete all users (DELETE)
  router.delete("/", async (req, res) => {
    try {
      const result = await Values.deleteMany({});
      res.status(200).json({ message: "All values deleted successfully", result });
    } catch (error) {
      console.error("Error deleting valueslist:", error);
      res.status(500).json({ message: "Failed to delete valueslist", error });
    }
  });


module.exports = router;