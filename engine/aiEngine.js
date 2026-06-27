const OpenAI = require("openai");

const { loadAllBrain } = require("./brainLoader");
const buildPrompt = require("./promptBuilder");
const memory = require("./memory");
const loadWebsite = require("./websiteLoader");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getReply(userId, userMessage) {

  // Save user message
  memory.addUserMessage(userId, userMessage);

  // Load business knowledge
  const brain = loadAllBrain();
  brain.website = await loadWebsite();

  // Load conversation
  const conversation = memory.getConversation(userId);

  // Build final prompt
  const prompt = buildPrompt(brain, conversation);

  // Ask GPT
  const response = await client.responses.create({
    model: "gpt-5.5",
    input: prompt
  });

  const reply = response.output_text;

  // Save assistant reply
  memory.addAssistantMessage(userId, reply);

  return reply;
}

module.exports = {
  getReply
};
