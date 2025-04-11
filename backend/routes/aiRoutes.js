const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const dotenv = require("dotenv");
const { OPENAI_API_KEY } = require('../config');

// Load environment variables
dotenv.config();

// Log the API key for debugging
console.log("This is OPENAI_API_KEY:", OPENAI_API_KEY);

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

router.post("/generate-proposals", async (req, res) => {
  try {
    console.log("POST request received at /api/ai/generate-proposals");
    console.log("Request body:", req.body);

    const prompt = req.body.prompt || "Generate a list of company values with descriptions.";
    const response = await client.responses.create({
      model: "gpt-4",
      input: prompt,
    });

    console.log("OpenAI API Response:", response);

    // Extract the generated text from the response
    let outputText = response.output_text;

    if (!outputText || typeof outputText !== "string") {
      throw new Error("No valid output text received from OpenAI API");
    }

    // Sanitize the response to remove invalid characters
    outputText = outputText.replace(/[^\x20-\x7E]/g, ""); // Remove non-ASCII characters
    console.log("Sanitized Output Text:", outputText);

    // Parse the JSON string into an object
    let parsedData;
    try {
      parsedData = JSON.parse(outputText);
    } catch (parseError) {
      throw new Error("Failed to parse JSON from AI response. Ensure the prompt generates valid JSON.");
    }

    // Ensure the parsed data contains the expected structure
    if (parsedData.arvot && Array.isArray(parsedData.arvot)) {
      res.json({ proposals: parsedData.arvot }); // Send the proposals to the frontend
    } else {
      throw new Error("Invalid data structure received from AI.");
    }
  } catch (error) {
    console.error("Error generating proposals from AI:", error);
    res.status(500).json({ error: "Failed to generate proposals. Please try again." });
  }
});

module.exports = router;