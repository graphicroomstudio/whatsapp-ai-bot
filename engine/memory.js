const conversations = {};

const MAX_MESSAGES = 20;

function addUserMessage(userId, message) {
  if (!conversations[userId]) {
    conversations[userId] = [];
  }

  conversations[userId].push({
    role: "user",
    content: message
  });

  if (conversations[userId].length > MAX_MESSAGES) {
    conversations[userId] = conversations[userId].slice(-MAX_MESSAGES);
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

  if (conversations[userId].length > MAX_MESSAGES) {
    conversations[userId] = conversations[userId].slice(-MAX_MESSAGES);
  }
}

function getConversation(userId) {
  return conversations[userId] || [];
}

function clearConversation(userId) {
  delete conversations[userId];
}

module.exports = {
  addUserMessage,
  addAssistantMessage,
  getConversation,
  clearConversation
};
