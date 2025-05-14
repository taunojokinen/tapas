// backend/server.js
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./utils/db'); // Database connection utility
const bodyParser = require("body-parser");

const prosConsRoutes = require("./routes/proscons");
const teamRoutes = require("./routes/teamRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userlistRoutes = require("./routes/userlist"); // Tuo käyttäjälistareitit
const valuesRoutes = require("./routes/values"); // Tuo arvotietojen reitit
const aiRoutes = require("./routes/aiRoutes"); // Import the AI routes
const authRoutes = require("./routes/authRoutes"); // Tuo autentikaatioreitit
const userRoutes = require("./routes/userRoutes"); // Tuo käyttäjäreitit
const strategiatRoutes = require("./routes/strategiat"); // Tuo strategiareitit
const valueProposalRoutes = require("./routes/valueProposalRoutes"); // Tuo valueProposalRoutes
const myObjectiveRoutes = require("./routes/myObjectiveRoutes"); // Tuo myObjectiveRoutes
const saveSelections = require("./routes/saveSelections");

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // React-sovelluksen osoite
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Lisää PATCH tähän
  allowedHeaders: ['Content-Type', 'Authorization'], // Tässä voi lisätä tarvittavat headerit
  credentials: true, // Jos käytät evästeitä
};

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

app.use("/api/proscons", prosConsRoutes);
app.use("/api/strategiat", strategiatRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/selections", saveSelections);
app.use("/api/userlist", userlistRoutes); // Käyttäjälistareitit käyttöön
app.use("/api/values", valuesRoutes); // Arvotietojen reitit käyttöön
app.use("/api/ai", aiRoutes); // AI-reitit käyttöön
app.use("/api/valueproposals", valueProposalRoutes); // valueProposalRoutes käyttöön
app.use("/api/myobjectives", myObjectiveRoutes); // myObjectiveRoutes käyttöön

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
app.listen(5000, '0.0.0.0', () => {
  console.log('Backend running on http://localhost:5000');
});

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

