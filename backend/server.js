// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");  // Tuo kirjautumisreitit
const User = require("./models/User");
const userRoutes = require("./routes/users");  // Tuo käyttäjäreitit
const usersRoutes = require("./routes/users"); // Tuodaan käyttäjäreitit
const prosConsRoutes = require("./routes/proscons");
const teamRoutes = require("./routes/teamRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userlistRoutes = require("./routes/userlist"); // Tuo käyttäjälistareitit
const valuesRoutes = require("./routes/values"); // Tuo arvotietojen reitit
const aiRoutes = require("./routes/ai"); // Import the AI routes

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//const PORT = process.env.PORT || 5000;
const PORT = 5000;
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

app.post("/api/auth/register", (req, res) => {
  console.log("Vastaanotettu data:", req.body);
});

app.delete("/api/users/:id", async (req, res) => {
  //console.log("Poistopyyntö vastaanotettu ID:", req.params.id); // ✅ Tarkista, mikä ID tulee frontendistä

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      console.log("Käyttäjää ei löydy ID:llä:", req.params.id);
      return res.status(404).json({ message: "Käyttäjää ei löytynyt" });
    }
    res.json({ message: "Käyttäjä poistettu onnistuneesti" });
  } catch (error) {
    console.error("Virhe käyttäjän poistossa:", error);
    res.status(500).json({ message: "Virhe käyttäjän poistossa", error: error.message });
  }
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
