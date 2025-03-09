const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');  // Muista tarkistaa polku
const router = express.Router();

// Rekisteröinti reitti
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, manager } = req.body;

    // Tarkista, että kaikki kentät on täytetty
    if (!name || !email || !password || !role || !manager) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Tarkista, onko käyttäjä jo olemassa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Kryptaa salasana
    const hashedPassword = await bcrypt.hash(password, 10);

    // Luo uusi käyttäjä
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      manager
    });

    await user.save(); // Tallenna käyttäjä tietokantaan

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user", details: error.message });
  }
});

module.exports = router;
