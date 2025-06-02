const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const dotenv = require("dotenv");
const { OPENAI_API_KEY } = require("../config");

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    console.log("Received question:", question);
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Olet avulias tekoälyvalmentaja. Vastaat suomeksi. Olet kokenut HR-asiantuntija ja kommenttisi ovat rennon epävirallisia sekä hieman humoristisia.`,
        },
        { role: "user", content: question },
      ],
      max_tokens: 1500,
    });

    const answer =
      completion.choices[0]?.message?.content || "No answer generated.";
    console.log("OpenAI response:", answer);
    res.json({ answer });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Failed to get response from OpenAI." });
  }
});

module.exports = router;
