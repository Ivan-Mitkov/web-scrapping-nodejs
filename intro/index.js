const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
async function main() {
  const html = await request.get(
    "https://reactnativetutorial.net/css-selectors/"
  );
  // fs.writeFileSync("./test.html", html);
  const $ = await cheerio.load(html);
  const text = $("h1").text();
  fs.writeFileSync("./test.html", text);
}
async function multipleEls() {
  const html = await request.get(
    "https://reactnativetutorial.net/css-selectors/lesson2.html"
  );
  // fs.writeFileSync("./test.html", html);
  const $ = await cheerio.load(html);
  const text = [];
  $("h2").each((index, el) => {
    const textEl = $(el).text();
    text.push(textEl);
  });
  fs.writeFileSync("./test.html", text.join("\n"));
}

multipleEls();
