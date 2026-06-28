console.log("✅ Correct memory.js loaded");
const conversations = {};

function addUserMessage(userId, message) {

  if (!conversations[userId]) {
    conversations[userId] = [];
  }

  conversations[userId].push({
    role: "user",
    content: message
  });

  if (conversations[userId].length > 20) {
    conversations[userId] = conversations[userId].slice(-20);
  }

}

function addAssistantMessage(userId, message) {

  if (!conversations[userId]) {
    conversations[userId] = [];
  }

  conversations[userId].push({
    role: "assistant",
    content: message
  });

  if (conversations[userId].length > 20) {
    conversations[userId] = conversations[userId].slice(-20);
  }

}

function getConversation(userId) {
  return conversations[userId] || [];
}

module.exports = {
  addUserMessage,
  addAssistantMessage,
  getConversation
};
