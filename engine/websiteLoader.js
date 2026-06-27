const axios = require("axios");
const cheerio = require("cheerio");

async function loadWebsite() {
  try {
    const { data } = await axios.get("https://graphicroom.studio");

    const $ = cheerio.load(data);

    return {
      title: $("title").text(),
      description: $('meta[name="description"]').attr("content") || "",
      text: $("body").text().replace(/\s+/g, " ").trim()
    };

  } catch (err) {

    console.log("Website Load Error");

    return {};
  }
}

module.exports = loadWebsite;
