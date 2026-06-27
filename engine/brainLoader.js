const fs = require("fs");
const path = require("path");

function loadBrain(fileName) {
  const filePath = path.join(__dirname, "..", "brain", fileName);

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error(`❌ Error loading ${fileName}`);
    console.error(err);
    return {};
  }
}

function loadAllBrain() {
  return {
    company: loadBrain("company.json"),
    services: loadBrain("services.json"),
    pricing: loadBrain("pricing.json"),
    portfolio: loadBrain("portfolio.json"),
    process: loadBrain("process.json"),
    faq: loadBrain("faq.json")
  };
}

module.exports = {
  loadBrain,
  loadAllBrain
};
