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
      max_tokens: 3000,
    });

    const answer =
      completion.choices[0]?.message?.content || "No answer generated.";
      console.log("OpenAI response /ask:", answer);
    res.json({ answer });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Failed to get response from OpenAI." });
  }
});

router.post("/picture", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // Generate image with OpenAI (DALL·E 3, response_format: 'b64_json')
    const imageResponse = await client.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const b64 = imageResponse.data[0]?.b64_json;
    if (!b64) {
      return res.status(500).json({ error: "No image generated." });
    }

    // Return as data URL in JSON
    res.json({ imageUrl: `data:image/jpeg;base64,${b64}` });
  } catch (error) {
    console.error("OpenAI image error:", error);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

module.exports = router;
