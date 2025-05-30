const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    title: { type: String, required: true },
    supervisor: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'director', 'supervisor', 'employer'],  // 🔹 Roolit: admin, director, supervisor, employer
        default: 'employer',
    },
});

const Userlist = mongoose.model("Userlist", UserSchema);

module.exports = Userlist;