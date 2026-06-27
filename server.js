const express = require("express");

const app = express();
app.use(express.json());

// Environment Variables
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Home
app.get("/", (req, res) => {
  res.send("Graphic Room Studio WhatsApp Bot is Live 🚀");
});

// Webhook Verification
app.get("/webhook", (req, res) => {
  console.log("========= WEBHOOK VERIFY =========");
  console.log(req.query);

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook Verified Successfully");
    return res.status(200).send(challenge);
  }

  console.log("❌ Webhook Verification Failed");
  return res.sendStatus(403);
});

// Receive Messages
app.post("/webhook", async (req, res) => {

  console.log("========= WEBHOOK RECEIVED =========");
  console.log(JSON.stringify(req.body, null, 2));

  try {

    const body = req.body;

    if (body.object) {

      const message =
        body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (message) {

        const from = message.from;

        console.log("📩 Message From:", from);
        console.log("💬 Text:", message.text?.body);

        const reply = {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body:
              "👋 Welcome to Graphic Room Studio!\n\nThank you for contacting us.\n\nHow can we help you today?"
          }
        };

        const response = await fetch(
          `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(reply)
          }
        );

        const result = await response.json();

        console.log("📤 Facebook API Response:");
        console.log(result);

      } else {
        console.log("ℹ️ No incoming message found.");
      }

      return res.sendStatus(200);
    }

    return res.sendStatus(404);

  } catch (err) {

    console.error("❌ ERROR:");
    console.error(err);

    return res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
