const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const jsonData = { data: [] };
let newObj = {};

async function оirstAttempt() {
  const result = await request.get(
    "https://www.codingwithstefan.com/table-example/"
  );
  const $ = cheerio.load(result);

  $("body > table > tbody > tr > td").each((index, el) => {
    const tempIndex = (index + 1) % 3;
    const thisData = $(el).text();
    if (tempIndex === 0) {
      newObj.country = thisData;
    } else if (tempIndex === 1) {
      newObj = { ...newObj, company: thisData };
    } else if (tempIndex == 2) {
      newObj = { ...newObj, contact: thisData };
    }
    if (tempIndex === 0) {
      jsonData.data.push(newObj);
    }
  });
}
async function staticTableScrapping() {
  const result = await request.get(
    "https://www.codingwithstefan.com/table-example/"
  );
  const $ = cheerio.load(result);

  $("body > table > tbody > tr ").each((index, el) => {
    const company = $($(el).find("td")[0]).text();
    const contact = $($(el).find("td")[1]).text();
    const country = $($(el).find("td")[2]).text();
    if (index === 0) return true;
    const obj = { company, contact, country };
    jsonData.data.push(obj);
  });
  console.log(jsonData);
  await fs.writeFileSync("./test.json", JSON.stringify(jsonData));
}
//get object keys from table header
async function dynamic() {
  const result = await request.get(
    "https://www.codingwithstefan.com/table-example/"
  );
  const $ = cheerio.load(result);
  const tableHeaders = [];
  $("body > table > tbody > tr ").each((index, el) => {
    //headers
    if (index === 0) {
      const ths = $(el).find("th");
      ths.each((i, e) => {
        tableHeaders.push($(e).text().toLowerCase());
      });
      return true
    }
    // console.log(tableHeaders);
    const tableRaw = {};
    const tds = $(el).find("td");
    tds.each((i, e) => {
      tableRaw[tableHeaders[i]] = $(e).text();
    });

    jsonData.data.push(tableRaw);
  });
  console.log(jsonData);
  // await fs.writeFileSync("./test.json", JSON.stringify(jsonData));
}

dynamic();
