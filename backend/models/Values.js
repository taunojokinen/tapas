const mongoose = require("mongoose");

const ValuesSchema = new mongoose.Schema({
    nimi: { type: String, required: true },
    kuvaus: { type: String, required: true },
    tärkeys: { type: Number, required: false },
});

const Values = mongoose.model("Values", ValuesSchema);

module.exports = Values;