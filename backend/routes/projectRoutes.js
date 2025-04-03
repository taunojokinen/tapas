const express = require("express");
const Project = require("../models/Project");

const router = express.Router();

// Hae kaikki projektit
router.get("/", async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
});

// Lisää uusi projekti
router.post("/", async (req, res) => {
    const newProject = new Project({ name: req.body.name });
    await newProject.save();
    res.json(newProject);
});

// Poista projekti
router.delete("/:id", async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
});

module.exports = router;
