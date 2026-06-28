const OpenAI = require("openai");

const { loadAllBrain } = require("./brainLoader");
const buildPrompt = require("./promptBuilder");
const memory = require("./memory");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getReply(userId, userMessage) {

  memory.addUserMessage(userId, userMessage);

  const brain = loadAllBrain();

  const conversation = memory.getConversation(userId);

  const messages = buildPrompt(brain, conversation);

console.log(JSON.stringify(messages, null, 2));

const response = await client.chat.completions.create({
  model: "gpt-5.5",
  messages,
  temperature: 0.7
});

  const reply = response.choices[0].message.content;

  memory.addAssistantMessage(userId, reply);

  return reply;
}

module.exports = {
  getReply
};
