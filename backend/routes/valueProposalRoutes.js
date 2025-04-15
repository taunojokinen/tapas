const express = require("express");
const ValueProposals = require("../models/ValueProposals"); // Import the ValueProposals model
const checkRole = require("../middleware/checkRole"); // Middleware for role-based access
const router = express.Router();
const mongoose = require("mongoose");

// GET: Fetch all value proposals
router.get("/", async (req, res) => {
  try {
    const proposals = await ValueProposals.find(); // Fetch all documents from the collection
    res.json(proposals); // Send the proposals as a JSON response
  } catch (error) {
    console.error("Error fetching value proposals:", error);
    res.status(500).json({ error: "Failed to fetch value proposals." });
  }
});

// PUT: Update a specific value proposal by ID
// PUT: Replace multiple value proposals
// PUT: Replace or create multiple value proposals
router.put("/", async (req, res) => {
    try {
      const proposals = req.body; // Expect an array of proposals
  
      if (!Array.isArray(proposals)) {
        return res.status(400).json({ error: "Request body must be an array of proposals." });
      }
  
      const results = [];
      for (const proposal of proposals) {
        if (!proposal._id) {
          // If no _id is provided, create a new document
          const newProposal = new ValueProposals(proposal);
          const savedProposal = await newProposal.save();
          results.push(savedProposal);
        } else if (mongoose.Types.ObjectId.isValid(proposal._id)) {
          // If _id is provided, update the document
          const updatedProposal = await ValueProposals.findByIdAndUpdate(
            proposal._id,
            proposal,
            { new: true, runValidators: true }
          );
          if (updatedProposal) {
            results.push(updatedProposal);
          } else {
            // If no document is found with the given _id, create a new one
            const newProposal = new ValueProposals(proposal);
            const savedProposal = await newProposal.save();
            results.push(savedProposal);
          }
        } else {
          return res.status(400).json({ error: `Invalid _id for proposal: ${JSON.stringify(proposal)}` });
        }
      }
  
      res.json({ message: "Value proposals processed successfully.", data: results });
    } catch (error) {
      console.error("Error processing value proposals:", error);
      res.status(500).json({ error: "Failed to process value proposals." });
    }
  });
  

  // POST: Create a new value proposal
// POST: Create one or multiple value proposals
router.post("/", async (req, res) => {
    try {
      const proposals = req.body; // Expect an array of proposals or a single proposal object
      console.log("Received proposals:", proposals); // Log the received proposals for debugging
  
      // Check if the request body is an array
      if (Array.isArray(proposals)) {
        const savedProposals = await ValueProposals.insertMany(proposals); // Insert multiple documents
        res.status(201).json({ message: "Value proposals created successfully.", data: savedProposals });
      } else {
        const newProposal = new ValueProposals(proposals); // Create a single document
        const savedProposal = await newProposal.save(); // Save the document to the database
        res.status(201).json({ message: "Value proposal created successfully.", data: savedProposal });
      }
    } catch (error) {
      console.error("Error creating value proposals:", error);
      res.status(500).json({ error: "Failed to create value proposals." });
    }
  });

  // DELETE: Delete a specific value proposal by ID
// DELETE: Delete all value proposals
router.delete("/", async (req, res) => {
    try {
      const result = await ValueProposals.deleteMany(); // Delete all documents in the collection
      res.json({ message: "All value proposals deleted successfully.", data: result });
    } catch (error) {
      console.error("Error deleting all value proposals:", error);
      res.status(500).json({ error: "Failed to delete value proposals." });
    }
  });

module.exports = router;