const express = require("express");
const router = express.Router(); // Luo reititin
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Tarkista, että User on oikein importattu

// Rekisteröinti-reitti
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user", details: error.message });
  }
});

// **Vie router käyttöön muille tiedostoille**
module.exports = router;
