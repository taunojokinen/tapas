const mongoose = require("mongoose");

const strategiaSchema = new mongoose.Schema({
  nimi: { type: String, required: true },
  mittari: { type: String, required: true }, // Lisätään mittari kenttä
  seuranta: { type: String, required: true }, // Lisätään seuranta kenttä
});

module.exports = mongoose.model("Strategia", strategiaSchema);
