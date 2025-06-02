const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const dotenv = require("dotenv");
const { OPENAI_API_KEY } = require('../config');

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});


router.post("/generate-proposals", async (req, res) => {
  try {
    const systemContent = req.body.systemContent || "You are a comedian only speaking finnish";
    const prompt = req.body.prompt || "Generate a list of three company values with descriptions. Answer as valid JSON.";
    console.log("OpenAI API Prompt:", prompt);
    console.log("OpenAI API systemContent:", systemContent);

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: prompt }
      ]
    });

    let outputText = response.choices[0].message.content;

    if (!outputText || typeof outputText !== "string") {
      throw new Error("No valid output text received from OpenAI API");
    }

    // Sanitize the response to remove invalid characters but allow Scandinavian characters
    outputText = outputText.replace(/[^\x20-\x7EäöåÄÖÅ]/g, ""); // Allow ä, ö, å, Ä, Ö, Å

    // Replace invalid key names (e.g., "arvot:", "nimi:", "kuvaus:") with valid ones
    outputText = outputText
      .replace(/"\s*arvot\s*:\s*"\s*:/gi, '"arvot":')
      .replace(/"\s*nimi\s*:\s*"\s*:/gi, '"nimi":')
      .replace(/"\s*kuvaus\s*:\s*"\s*:/gi, '"kuvaus":');


    // Parse the JSON string into an object
    let parsedData;
    try {
      parsedData = JSON.parse(outputText);
    } catch (parseError) {
      console.error("Failed to parse JSON from AI response. Raw output:", outputText);
      throw new Error("Failed to parse JSON from AI response. Ensure the prompt generates valid JSON.");
    }

    // Ensure the parsed data contains the expected structure
    if (parsedData.arvot && Array.isArray(parsedData.arvot)) {
      const isValid = parsedData.arvot.every(
        (item) => item.nimi && item.kuvaus
      );
      if (!isValid) {
        throw new Error("Invalid data structure: Missing 'nimi' or 'kuvaus' in one or more items.");
      }
      res.json({ proposals: parsedData.arvot }); // Send the proposals to the frontend
    } else {
      throw new Error("Invalid data structure received from AI.");
    }
  } catch (error) {
    console.error("Error generating proposals from AI:", error);
    res.status(500).json({ error: "Failed to generate proposals. Please try again." });
  }
});

router.post("/generate-proposals/test", async (req, res) => {
  try {
    const prompt = req.body.prompt || "Generate a list of three company values with descriptions. Answer as valid JSON.";
    console.log("Prompt sent to OpenAI 4o mini API:", prompt);
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ]
    });

    let outputText = response.choices[0].message.content;
    console.log("OpenAI 4o mini API Response:", outputText);

    // ...rest of your code for sanitizing and parsing outputText...
  } catch (error) {
    console.error("Error generating proposals from AI:", error);
  }
});

module.exports = router;