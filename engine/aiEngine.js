const OpenAI = require("openai");

const { loadAllBrain } = require("./brainLoader");
const buildPrompt = require("./promptBuilder");
const memory = require("./memory");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getReply(userId, userMessage, imageUrl = null) {

  // Save user message
  memory.addUserMessage(userId, userMessage);

  // Load business knowledge
  const brain = loadAllBrain();

  // Load previous conversation
  const conversation = memory.getConversation(userId);

  // Build system prompt
  const prompt = buildPrompt(brain, conversation);

  const input = [];

  // System Prompt
  input.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text: prompt
      }
    ]
  });

  // User Message
  if (imageUrl) {

    input.push({
      role: "user",
      content: [
        {
          type: "input_text",
          text: userMessage || "Customer sent an image."
        },
        {
          type: "input_image",
          image_url: imageUrl
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

  // Ask GPT
  const response = await client.responses.create({
    model: "gpt-5.5",
    input
  });

  const reply = response.output_text;

  // Save AI reply
  memory.addAssistantMessage(userId, reply);

  return reply;

}

module.exports = {
  getReply
};
