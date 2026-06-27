const express = require("express");
const { getReply } = require("./engine/aiEngine");
require("./scheduler/followup");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Home
app.get("/", (req, res) => {
  res.send("Graphic Room Studio WhatsApp AI Bot is Live 🚀");
});

// Webhook Verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Receive Messages
app.post("/webhook", async (req, res) => {
  try {
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message || !message.text?.body) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const userMessage = message.text?.body || "";
const imageId = message.image?.id || null;
    
    console.log("📩", from, ":", userMessage);

    const assistantReply = await getReply(from, userMessage, imageId);
    
    await fetch(
      `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: assistantReply
          }
        })
      }
    );

    console.log("✅ Reply Sent");

    return res.sendStatus(200);

  } catch (err) {

    console.error(err);

    return res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});
