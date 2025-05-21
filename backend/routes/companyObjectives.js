const express = require('express');
const router = express.Router();
const CompanyObjective = require('../models/CompanyObjective');

// GET: hae kaikki
router.get('/', async (req, res) => {
  try {
    const objectives = await CompanyObjective.find();
    //console.log("Haetut tiedot: ", objectives)
    res.json(objectives);
  } catch (error) {
    res.status(500).json({ message: "Virhe tiedon haussa" });
  }
});

// POST: lisää uusi
router.post("/", async (req, res) => {
    const { perustehtava, paamaara, avainstrategiat, nykytila } = req.body;
    console.log("Vastaanotettu data:", req.body);
    try {
      const companyObjective = new CompanyObjective({
        perustehtava,
        paamaara,
        avainstrategiat,
        nykytila,
      });
  
      await companyObjective.save();
      res.status(201).json(companyObjective);
    } catch (error) {
      res.status(400).json({ message: "Virhe tallennuksessa", error });
    }
  });

// DELETE: poista id:n perusteella
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await CompanyObjective.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Objective not found' });
    }
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('POST error:', error); // 🛠️ Tulosta virhe konsoliin
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT: korvaa koko objektin
router.put('/:id', async (req, res) => {
  console.log("Päivitettävä data:", req.body);
  try {
    const { perustehtava, paamaara, avainstrategiat, nykytila } = req.body;
    const updated = await CompanyObjective.findByIdAndUpdate(
      req.params.id,
      { perustehtava, paamaara, avainstrategiat, nykytila },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Objective not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('POST error:', error); // 🛠️ Tulosta virhe konsoliin
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH: päivitä yksittäisiä kenttiä
router.patch('/:id', async (req, res) => {
  try {
    const updated = await CompanyObjective.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Objective not found' });
    }
    res.json(updated);
  } catch (error) {
    //console.error('POST error:', error); // 🛠️ Tulosta virhe konsoliin
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
