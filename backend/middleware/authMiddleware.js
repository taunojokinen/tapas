const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Ei tunnistettu" });

  try {
    // Tarkista token ja dekoodaa se
    const decoded = jwt.verify(token, "SECRET_KEY");  // Vaihda "SECRET_KEY" omaksi salaiseksi avaimeksi
    req.user = decoded;  // Lisää käyttäjän tiedot req.user:iin (sisältää myös roolin ja ID:n)
    next();
  } catch (error) {
    res.status(400).json({ message: "Virheellinen token" });
  }
};

module.exports = authMiddleware;
