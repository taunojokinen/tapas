const express = require("express");
const User = require("../models/User"); // Tuodaan User-malli
const checkRole = require("../middleware/checkRole")
const router = express.Router();

// Luo uusi käyttäjä (POST)
router.post("/users", checkRole("admin"), async (req, res) => {
  const { name, email, password, role, manager } = req.body;
  
  const newUser = new User({ name, email, password, role, manager });
  await newUser.save();
  res.status(201).json(newUser);
});


// Hae kaikki käyttäjät (GET)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Virhe haussa", error });
  }
});

router.get("/users/me", checkRole("user"), async (req, res) => {
  const user = await User.findById(req.user._id);  // `req.user` tulee JWT-tunnuksesta
  if (!user) return res.status(404).json({ message: "Käyttäjää ei löytynyt" });
  res.json(user);
});

router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Käyttäjää ei löytynyt" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Virhe päivityksessä", error });
  }
});

router.put("/users/:id", checkRole("manager"), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Käyttäjää ei löytynyt" });

  // Päivitä vain tiettyjä kenttiä
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  await user.save();

  res.json(user);
});


router.delete("/users/:id", checkRole("admin"), async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "Käyttäjää ei löytynyt" });
  res.json({ message: "Käyttäjä poistettu" });
});

// users.js - API-pyyntö suojattuihin reitteihin
const fetchUsers = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:5000/api/users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,  // Lähetä token headerissa
    },
  });

  const users = await response.json();
  console.log(users);
};

module.exports = router;
