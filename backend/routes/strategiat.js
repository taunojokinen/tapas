const express = require("express");
const router = express.Router();
const Strategia = require("../models/Strategia"); // Luo tämä malli

// Hae kaikki strategiat
router.get("/", async (req, res) => {
  try {
    const strategiat = await Strategia.find();
    res.json(strategiat);
  } catch (error) {
    res.status(500).json({ error: "Tietojen hakeminen epäonnistui." });
  }
});

/* // Lisää uusi strategia
router.post("/", async (req, res) => {
  try {
    const uusiStrategia = new Strategia({ nimi: req.body.nimi });
    await uusiStrategia.save();
    res.json({ message: "Strategia lisätty!" });
  } catch (error) {
    res.status(500).json({ error: "Strategian lisääminen epäonnistui." });
  }
}); */
// Lisää uusi strategia
router.post('/', async (req, res) => {
  console.log("Strategia: ", req.body);
    try {
      const { nimi, mittari, seuranta } = req.body;
  
      if (!nimi || !mittari || !seuranta) {
        return res.status(400).json({ error: 'Kaikki kentät täytyy täyttää (nimi, mittari, seuranta)' });
      }
      // Luodaan uusi strategia
      const uusiStrategia = new Strategia({
        nimi,
        mittari, // Tässä lisätään mittari
        seuranta, // Tässä lisätään seuranta
      });
  
      // Tallennetaan uusi strategia tietokantaan
      await uusiStrategia.save();
      res.status(201).json(uusiStrategia); // Palautetaan tallennettu strategia
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Tapahtui virhe tallennettaessa strategiaa' });
    }
  });
// Hae kaikki strategiat

router.get("/all", async (req, res) => {
    try {
      const strategiat = await Strategia.find();
      res.json(strategiat);
    } catch (error) {
      res.status(500).json({ error: "Tietojen hakeminen epäonnistui." });
    }
  });

// Poista strategia ID:n perusteella
router.delete("/:id", async (req, res) => {
    try {
      const strategia = await Strategia.findById(req.params.id);
      if (!strategia) {
        return res.status(404).json({ error: "Strategia ei löytynyt." });
      }
  
      await Strategia.findByIdAndDelete(req.params.id);
      res.json({ message: "Strategia poistettu!" });
    } catch (error) {
      res.status(500).json({ error: "Strategian poistaminen epäonnistui." });
    }
  });
  

module.exports = router;
