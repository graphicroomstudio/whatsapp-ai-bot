const OpenAI = require("openai");

const { loadAllBrain } = require("./brainLoader");
const buildPrompt = require("./promptBuilder");
const memory = require("./memory");
const loadWebsite = require("./websiteLoader");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getReply(userId, userMessage, imageId = null) {

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
  const input = [];

input.push({
  role: "system",
  content: [
    {
      type: "input_text",
      text: prompt
    }
  ]
});

if (imageId) {

  input.push({
    role: "user",
    content: [
      {
        type: "input_text",
        text: userMessage
      },
      {
        type: "input_image",
        image_url: imageId
      }
    ]
  });

} else {

  input.push({
    role: "user",
    content: [
      {
        type: "input_text",
        text: userMessage
      }
    ]
  });

}

const response = await client.responses.create({
  model: "gpt-5.5",
  input
});

  const reply = response.output_text;

  // Save assistant reply
  memory.addAssistantMessage(userId, reply);

  return reply;
}

module.exports = {
  getReply
};
