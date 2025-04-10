const mongoose = require("mongoose");

const ValuesSchema = new mongoose.Schema({
    tärkeys: { type: Number, required: true },
    nimi: { type: String, required: true },
    kuvaus: { type: String, required: true },
});

const Values = mongoose.model("Values", ValuesSchema);

module.exports = Values;