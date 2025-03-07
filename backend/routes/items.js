// backend/routes/items.js
const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

// Hae kaikki tuotteet
router.get('/', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Lisää uusi tuote
router.post('/', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

// Poista tuote
router.delete('/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
