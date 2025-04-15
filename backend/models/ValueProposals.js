const mongoose = require("mongoose");

const Values = new mongoose.Schema({
    nimi: { type: String, required: true },
    kuvaus: { type: String, required: true },
    tärkeys: { type: Number, required: false },
});

const ValueProposalSchema = new mongoose.Schema({
    role: { type: String, required: true },
    values: { type: [Values], required: true }, // Array of Values
});

const ValueProposals = mongoose.model("ValueProposals", ValueProposalSchema);

module.exports = ValueProposals;