// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");  // Tuo kirjautumisreitit
const userRoutes = require("./routes/users");  // Tuo käyttäjäreitit
const usersRoutes = require("./routes/users"); // Tuodaan käyttäjäreitit

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Yhdistä MongoDB:hen
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Testireitti
app.get('/', (req, res) => {
  res.send('Backend toimii ja MongoDB on yhdistetty!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const itemsRoutes = require('./routes/items');
app.use('/api/items', itemsRoutes);
app.use("/api/auth", authRoutes);  // Kirjautumiseen liittyvät reitit
app.use("/api/users", userRoutes);  // Käyttäjien hallinta

app.use("/users", usersRoutes); // Käyttäjäreitit käyttöön

