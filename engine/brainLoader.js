const fs = require("fs");
const path = require("path");

function load(file) {
  try {
    const filePath = path.join(__dirname, "..", "brain", file);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error("Error loading:", file);
    return {};
  }
}

function loadAllBrain() {
  return {
    company: load("company.json"),
    services: load("services.json"),
    pricing: load("pricing.json"),
    portfolio: load("portfolio.json"),
    process: load("process.json"),
    faq: load("faq.json")
  };
}

module.exports = {
  loadAllBrain
};
