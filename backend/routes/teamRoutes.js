const express = require("express");
const Team = require("../models/Team");

const router = express.Router();

// Hae kaikki tiimit
router.get("/", async (req, res) => {
    const teams = await Team.find();
    res.json(teams);
});

// Lisää uusi tiimi
router.post("/", async (req, res) => {
    const newTeam = new Team({ name: req.body.name });
    await newTeam.save();
    res.json(newTeam);
});

// Poista tiimi
router.delete("/:id", async (req, res) => {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Team deleted" });
});

module.exports = router;
