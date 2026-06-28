const OpenAI = require("openai");

const { loadAllBrain } = require("./brainLoader");
const buildPrompt = require("./promptBuilder");
const memory = require("./memory");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getReply(userId, userMessage) {

  // Save user message
  memory.addUserMessage(userId, userMessage);

  // Load brain
  const brain = loadAllBrain();

  // Build system prompt
  const systemPrompt = buildPrompt(brain);

  // Load conversation history
  const conversation = memory.getConversation(userId);

  // Build messages
  const messages = [
    {
      role: "system",
      content: systemPrompt
    },
    ...conversation
  ];

  // Call OpenAI
  const response = await client.chat.completions.create({
    model: "gpt-5.5",
    messages,
    temperature: 0.7,
    max_tokens: 500
  });

  const reply = response.choices[0].message.content.trim();

  // Save assistant reply
  memory.addAssistantMessage(userId, reply);

  return reply;
}

module.exports = {
  getReply
};
