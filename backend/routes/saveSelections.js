const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Luo MongoDB-malli
const selectionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nimi kenttä
    teams: [{ type: Object, required: true }],
    projects: [{ type: Object, required: true }],
    strategies: [{ type: Object, required: true }],
    tasks: [{ type: Object, required: true }],
    createdAt: { type: Date, default: Date.now } // Aikaleima kenttä
  });
  
  const Selection = mongoose.model("Selection", selectionSchema);
// POST-reitti tallennukselle
router.post("/", async (req, res) => {
  try {
    const { name, teams, projects, strategies, tasks } = req.body;

    const newSelection = new Selection({
      name,
      teams,
      projects,
      strategies,
      tasks,
    });

    await newSelection.save();
    res.status(201).json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error("Error saving selections:", error);
    res.status(500).json({ error: "Server error" });
  }
});

 router.get("/", async (req, res) => {
    try {
      // Hae kaikki valintakokonaisuudet ja järjestä ne aikaleiman mukaan
      const selections = await Selection.find().sort({ createdAt: -1 }); // -1 tarkoittaa laskevaa järjestystä
      res.status(200).json(selections);
    } catch (error) {
      console.error("Virhe haussa:", error);
      res.status(500).send({ message: "Haku epäonnistui." });
    }
  }); 


module.exports = router;
