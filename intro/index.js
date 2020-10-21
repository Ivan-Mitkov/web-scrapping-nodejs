const request = require("request-promise");
const cheerio = require("cheerio");

async function main() {
  const html = await request.get(
    "https://reactnativetutorial.net/css-selectors/"
  );
}

main();
