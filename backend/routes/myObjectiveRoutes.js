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
    res.status(500).json({
      success: false,
      error: "Failed to create or update MyObjectives",
    });
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
    const { user } = req.query;
    if (!user) {
      return res
        .status(400)
        .json({ error: "User query parameter is required" });
    }

    let objectives = await MyObjectives.findOne({ user });

    if (!objectives) {
      let defaultObjectives = await MyObjectives.findOne({
        user: "defaultuser",
      });

      // If no defaultuser in DB, use hard-coded fallback
      if (!defaultObjectives) {
        defaultObjectives = {
          title: "Default Title",
          mission: {
            img: "",
            otsikko: "Default Otsikko",
            kuvaus: "Default Kuvaus",
          },
          objectives: [],
          tasks: [],
          hindrances: [],
          promoters: [],
          date: new Date(),
          // add other fields as needed
        };
      } else {
        defaultObjectives = defaultObjectives.toObject();
      }

      objectives = new MyObjectives({
        ...defaultObjectives,
        user,
        _id: undefined,
      });

      await objectives.save();
    }
    // Defensive check: ensure mission always exists and has required fields
    if (!objectives.mission || typeof objectives.mission !== "object") {
      objectives.mission = {
        img: "",
        otsikko: "Default Otsikko",
        kuvaus: "Default Kuvaus",
      };
    } else {
      // Ensure all fields exist
      objectives.mission.img = objectives.mission.img || "";
      objectives.mission.otsikko =
        objectives.mission.otsikko || "Default Otsikko";
      objectives.mission.kuvaus = objectives.mission.kuvaus || "Default Kuvaus";
    }

    res.status(200).json(objectives);
  } catch (error) {
    console.error("Error retrieving or creating MyObjectives:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve or create MyObjectives" });
  }
});

router.delete("/:user", async (req, res) => {
  try {
    const { user } = req.params;

    // Find and delete the document matching the user
    const deletedObjectives = await MyObjectives.findOneAndDelete({ user });

    if (deletedObjectives) {
      res.status(200).json({
        message: "MyObjectives successfully deleted",
        deletedObjectives,
      });
    } else {
      res
        .status(404)
        .json({ error: "MyObjectives not found for the specified user" });
    }
  } catch (error) {
    console.error("Error deleting MyObjectives:", error);
    res.status(500).json({ error: "Failed to delete MyObjectives" });
  }
});

module.exports = router;
