const conversations = {};

function getConversation(userId) {
  if (!conversations[userId]) {
    conversations[userId] = [];
  }

  return conversations[userId];
}

function addUserMessage(userId, message) {
  getConversation(userId).push({
    role: "user",
    content: message
  });
}

function addAssistantMessage(userId, message) {
  getConversation(userId).push({
    role: "assistant",
    content: message
  });
}

function clearConversation(userId) {
  conversations[userId] = [];
}

module.exports = {
  getConversation,
  addUserMessage,
  addAssistantMessage,
  clearConversation
};
