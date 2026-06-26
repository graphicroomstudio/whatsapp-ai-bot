const express = require("express");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "graphicroom123";
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Home
app.get("/", (req, res) => {
  res.send("Graphic Room Studio WhatsApp Bot is Live 🚀");
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
    const body = req.body;

    if (body.object) {
      const message =
        body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (message) {
        const from = message.from;

        const reply = {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body:
              "👋 Welcome to Graphic Room Studio!\n\nThank you for contacting us.\n\nHow can we help you today?"
          }
        };

        await fetch(
          https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages,
          {
            method: "POST",
            headers: {
              Authorization: Bearer ${ACCESS_TOKEN},
              "Content-Type": "application/json"
            },
            body: JSON.stringify(reply)
          }
        );
      }

      return res.sendStatus(200);
    }

    res.sendStatus(404);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(Server running on port ${PORT});
});
