const mongoose = require('mongoose');

const strategiaSchema = new mongoose.Schema({
  tavoite: String,
  omistaja: String,
  toimenpide: String,
  seuranta: {
    type: String,
    enum: ["green", "yellow", "red"],
    default: "green",
  },
});

const companyObjectiveSchema = new mongoose.Schema({
    perustehtava: [String],
    paamaara: [String],
    avainstrategiat: [strategiaSchema],
    nykytila: {
      pros: [String],
      cons: [String],
    },
  }, {
    timestamps: true,
  });
module.exports = mongoose.model('CompanyObjective', companyObjectiveSchema);
