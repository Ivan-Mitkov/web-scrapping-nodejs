const puppeteer = require("puppeteer");
const cherio = require("cherio");
const fs = require("fs");
const { resolve } = require("path");
async function scrapeListings(page) {
  //open the page
  await page.goto("https://sfbay.craigslist.org/search/sof?");
  //get the html
  const html = await page.content();
  // load html in  node
  const $ = cherio.load(html);
  //get parent element
  const data = $(".result-info")
    .map((i, e) => {
      const titleElement = $(e).find(".result-title");
      const timeElement = $(e).find(".result-date");
      const url = $(titleElement).attr("href");
      const title = $(titleElement).text();
      const datePosted = new Date($(timeElement).attr("datetime"));
      const location = $(e)
        .find(".result-hood")
        .text()
        .trim()
        .replace("(", "")
        .replace(")", "");
      return { datePosted, title, url, location };
    })
    //cherio need to use .get() otherwise will get cherio objects
    .get();
  // console.log(data);
  return data;
}
async function scrapeJobDescriptions(listings, page) {
  //forEach do things in parallel kind of , and not working well with puppeteer
  for (let i = 0; i < listings.length; i++) {
    await page.goto(listings[i].url);
    //get the html
    const html = await page.content();
    // load html in  node
    const $ = cherio.load(html);
    const text = $("#postingbody").text();
    // console.log(text)
    listings[i].jobDescription = text;
    const compensation = $(".attrgroup span:nth-child(1) > b").text();
    listings[i].compensation = compensation;
    await sleep(1000);
  }
  return listings;
}

async function sleep(millisecunds) {
  return new Promise((resolve) => setTimeout(resolve, millisecunds));
}
async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const listings = await scrapeListings(page);
  const listingsWithJobDescription = await scrapeJobDescriptions(
    listings,
    page
  );
  fs.writeFileSync("./data.json", JSON.stringify(listingsWithJobDescription));
}
main();
