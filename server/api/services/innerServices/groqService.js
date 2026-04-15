import Groq from "groq-sdk";

// Groq Cloud API client — provides fast inference on open-source LLMs
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Sends a prompt to the Groq-hosted Llama 3.3 70B model
 * and returns the text content of the first completion choice.
 */
export const askGroq = async (prompt, systemContent) => {
  const messages = [];

  if (systemContent) {
    messages.push({
      role: "system",
      content: systemContent
    });
  }

  messages.push({
    role: "user",
    content: prompt
  });

  const chatCompletion = await groq.chat.completions.create({
    messages,
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    max_tokens: 4096
  });

  return chatCompletion.choices[0].message.content;
};
