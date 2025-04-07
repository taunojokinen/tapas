const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/ai/generate-proposals", async (req, res) => {
  try {
    const prompt = req.body.prompt || "Generate a list of company values with descriptions.";
    const response = await client.responses.create({
      model: "gpt-4o",
      input: prompt,
    });

    const proposals = response.output_text
      .trim()
      .split("\n")
      .map((line) => {
        const [nimi, kuvaus] = line.split(":");
        return { nimi: nimi.trim(), kuvaus: kuvaus.trim() };
      });

    res.json({ proposals });
  } catch (error) {
    console.error("Error generating proposals:", error);
    res.status(500).json({ error: "Failed to generate proposals" });
  }
});

module.exports = router;