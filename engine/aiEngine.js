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

  // Load business data
  const brain = loadAllBrain();

  // Conversation history
  const conversation = memory.getConversation(userId);

  // System prompt
  const prompt = buildPrompt(brain);

  const input = [];

  // System message
  input.push({
    role: "system",
    content: [
      {
        type: "input_text",
        text: prompt
      }
    ]
  });

  // Previous conversation
  conversation.forEach(msg => {
    input.push({
      role: msg.role,
      content: [
        {
          type: "input_text",
          text: msg.content
        }
      ]
    });
  });

  // Current user message
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

  // Save assistant reply
  memory.addAssistantMessage(userId, reply);

  return reply;

}

module.exports = {
  getReply
};
