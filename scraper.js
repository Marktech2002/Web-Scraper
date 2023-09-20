const puppeteer = require("puppeteer");
const fs = require("fs");

/**
 * ? @desc scrape data from a URL Https://xxx.com
 * @method GET
 * @param Url
 * @returns data
 */
const fetchIt = async (url) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  console.log("Navigating to url");
  await page.goto(url); // navigate to the url
  await page.screenshot({ path: "drink.png", fullPage: true }); // screenshot of website
  console.log("Screenshot Saved");
  const champagneTypes = await page.$$eval(
    ".prods-grid-container .dng-product-card",
    (data) =>
      data.map((e) => ({
        url: e.querySelector(".dng-product-card a").href,
        title: e.querySelector(".dng-product-card span").innerText,
      }))
  );
  console.log(champagneTypes);
  // save to a file
  fs.writeFile("data.json", JSON.stringify(champagneTypes), (error) => {
    if (error) throw error;
    console.log("File saved successfully ");
  });
  await browser.close();
};

fetchIt("https://drinks.ng/champagne-bavwi/");
