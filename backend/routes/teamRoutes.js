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
    try {
        const { owner, name, type, mission, members } = req.body;

        // Create a new team with all required fields
        const newTeam = new Team({
            owner,
            name,
            type,
            mission: mission || "", // Optional field
            members: members || [], // Default to an empty array if not provided
        });

        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Poista tiimi
router.delete("/:id", async (req, res) => {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Team deleted" });
});

module.exports = router;
