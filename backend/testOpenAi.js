const OpenAI = require("openai");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

console.log("This is OPENAI_API_KEY:", process.env.OPENAI_API_KEY);


// Initialize OpenAI client with the API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Pass the API key explicitly
});

(async () => {
  try {
    const response = await client.responses.create({
      model: "gpt-4o",
      input: "Write a one-sentence bedtime story about a unicorn.",
    });

    console.log("Response:", response.output_text);
  } catch (error) {
    console.error("Error:", error);
  }
})();