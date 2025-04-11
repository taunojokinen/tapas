// backend/server.js
const dotenv = require('dotenv');

const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const connectDB = require('./utils/db'); // Database connection utility

const bodyParser = require("body-parser");

//const usersRoutes = require("./routes/users"); // Tuodaan käyttäjäreitit
const prosConsRoutes = require("./routes/proscons");
const teamRoutes = require("./routes/teamRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userlistRoutes = require("./routes/userlist"); // Tuo käyttäjälistareitit
const valuesRoutes = require("./routes/values"); // Tuo arvotietojen reitit
const aiRoutes = require("./routes/aiRoutes"); // Import the AI routes
const authRoutes = require("./routes/authRoutes"); // Tuo autentikaatioreitit
const userRoutes = require("./routes/userRoutes"); // Tuo käyttäjäreitit

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Initialize activeTokens map once when the app starts
app.locals.activeTokens = new Map();

dotenv.config(); // Lataa ympäristömuuttujat .env-tiedostosta

// Connect to the database
connectDB();

const itemsRoutes = require('./routes/items');
app.use('/api/items', itemsRoutes);

app.post("/api/auth/register", (req, res) => {
  console.log("Vastaanotettu data:", req.body);
});

app.delete("/api/arvot/:id", async (req, res) => {
  try {
    await ArvoModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Arvot poistettu onnistuneesti" });
  } catch (error) {
    res.status(500).json({ message: "Virhe poistamisessa", error: error.message });
  }
});


// Luo MongoDB-malli Yrityksen Arvoille
const ArvoSchema = new mongoose.Schema(
  {
    yritys: String,
    arvot: [{ nimi: String, kuvaus: String, tärkeys: Number }],
  },
  { timestamps: true } // Lisää aikaleimat (luonti & päivitys)
);

const ArvoModel = mongoose.model("Arvo", ArvoSchema);

// POST-reitti Yrityksen Arvojen tallentamiseen
app.post("/api/arvot", async (req, res) => {
  console.log("Pyynnön data / Arvot: ", req.body);
  try {
    const uusiArvo = new ArvoModel(req.body);
    await uusiArvo.save();
    res.status(201).json({ message: "Yrityksen arvot tallennettu onnistuneesti", data: uusiArvo });
  } catch (error) {
    res.status(500).json({ message: "Virhe tallennuksessa", error: error.message });
  }
});
// GET-reitti: Hae kaikki yrityksen arvot
app.get("/api/arvot", async (req, res) => {
  try {
    const arvot = await ArvoModel.find(); // Hakee kaikki dokumentit
    res.json(arvot);
  } catch (error) {
    res.status(500).json({ message: "Virhe tietojen haussa", error: error.message });
  }
});

app.use("/api/proscons", prosConsRoutes);

const strategiatRoutes = require("./routes/strategiat");
app.use("/api/strategiat", strategiatRoutes);

app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);

const saveSelections = require("./routes/saveSelections");
app.use("/api/selections", saveSelections);

app.use("/api/userlist", userlistRoutes); // Käyttäjälistareitit käyttöön

app.use("/api/values", valuesRoutes); // Arvotietojen reitit käyttöön
app.use("/api/ai", aiRoutes); // AI-reitit käyttöön

// Login endpoint
// Routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', userRoutes); // User-related routes



// Example route
app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login successful' });
});

// Start the server
app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

