const mongoose = require("mongoose");

const ValueProposalSchema = new mongoose.Schema({
    nimi: { type: String, required: true },
    kuvaus: { type: String, required: true },
    role: { type: String, required: false }, // Optional role field
});

const ValueProposals = mongoose.model("ValuePropoosals", ValueProposalSchema);

module.exports = ValueProposals;