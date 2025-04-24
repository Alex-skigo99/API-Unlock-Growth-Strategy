import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

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
