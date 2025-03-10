const mongoose = require("mongoose");

const prosConsSchema = new mongoose.Schema({
  pros: [String],
  cons: [String],
}, { timestamps: true }); // Lisää aikaleimat

const ProsCons = mongoose.model("ProsCons", prosConsSchema);
module.exports = ProsCons;
