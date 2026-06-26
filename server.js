const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Graphic Room Studio WhatsApp Bot is Live 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
