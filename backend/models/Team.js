const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: String,
});

module.exports = mongoose.model("Team", teamSchema);
