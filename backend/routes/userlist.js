const express = require("express");
const Userlist = require("../models/Userlist"); // Import the Userlist model
const checkRole = require("../middleware/checkRole");
const router = express.Router();

// Create a userlist (POST)
router.post("/", async (req, res) => {
    //console.log("Received request to create userlist:"); // Log the request body for debugging
    const users = req.body; // Expecting an array of user objects
    console.log("Received users:"); // Log the received users for debugging
  
    if (!Array.isArray(users)) {
      return res.status(400).json({ message: "Invalid data format. Expected an array of users." });
    }
  
    try {
      // Save all users to the database
      const savedUsers = await Userlist.insertMany(users);
      res.status(201).json({ message: "Users saved successfully!", savedUsers });
    } catch (error) {
      console.error("Error saving users:", error);
      res.status(500).json({ message: "Failed to save users", error });
    }
  });


// Get all users (GET)
router.get("/", async (req, res) => {
    try {
      const users = await Userlist.find(); // Fetch all users from the database
      
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found." }); // Return 404 if no users exist
    }
    res.status(200).json(users); // Return the users as JSON
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error fetching users", error });
    }
  });

// Delete all users (DELETE)
router.delete("/", async (req, res) => {
  try {
    const result = await Userlist.deleteMany({});
    res.status(200).json({ message: "All users deleted successfully", result });
  } catch (error) {
    console.error("Error deleting userlist:", error);
    res.status(500).json({ message: "Failed to delete userlist", error });
  }
});

module.exports = router;