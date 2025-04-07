const OpenAI = require("openai");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const client = new OpenAI();

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