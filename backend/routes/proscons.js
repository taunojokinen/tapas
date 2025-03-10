const express = require("express");
const router = express.Router();
const ProsCons = require("../models/ProsCons");

// Hae pros & cons (aina yksi dokumentti)
router.get("/", async (req, res) => {
  try {
    let data = await ProsCons.findOne();
    if (!data) {
      data = new ProsCons({ pros: [], cons: [] });
      await data.save();
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

// Lisää pro
router.post("/add-pro", async (req, res) => {
  try {
    const { pro } = req.body;
    let data = await ProsCons.findOne();
    if (!data) {
      data = new ProsCons({ pros: [], cons: [] });
    }
    data.pros.push(pro);
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error adding pro", error });
  }
});

// Lisää con
router.post("/add-con", async (req, res) => {
  try {
    const { con } = req.body;
    let data = await ProsCons.findOne();
    if (!data) {
      data = new ProsCons({ pros: [], cons: [] });
    }
    data.cons.push(con);
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error adding con", error });
  }
});

// Poista Pro
router.delete("/delete-pro", async (req, res) => {
    const { pro } = req.body;
    try {
      await ProsCons.updateOne({}, { $pull: { pros: pro } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Error deleting pro" });
    }
  });
  
  // Poista Con
  router.delete("/delete-con", async (req, res) => {
    const { con } = req.body;
    try {
      await ProsCons.updateOne({}, { $pull: { cons: con } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Error deleting con" });
    }
  });

module.exports = router;
