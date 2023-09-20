const puppeteer = require("puppeteer");
const fs = require("fs").promises; // Use fs.promises for async file operations

/**
 * ? @desc get Popular categories URL "https://drinks.ng/"
 * @method GET
 * @param Url
 * @returns data
 */
const scrapePopularCategories = async (url) => {
  const browser = await puppeteer.launch({ headless: "new"});
  const page = await browser.newPage();

  try {
    console.log("Navigating to homePage URL");
    await page.goto(url);
    
    const categories = await page.$$eval(".dng-product-category", (data) =>
      data.map((e) => ({
        imageSrc: e.querySelector("img").getAttribute("src"),
        link: e.getAttribute("href"),
        drink_type: e.querySelector("span").textContent.trim(),
      }))
    );

    // Save categories to a file
    await fs.writeFile("categories.json", JSON.stringify(categories));
    console.log("Categories saved successfully");
  } catch (error) {
    console.error("Error while scraping popular categories:", error);
  } finally {
    await browser.close();
  }
};

/**
 * ? @desc get champagne categories URL "https://drinks.ng/champagne-bavwi/"
 * @method GET
 * @param Url
 * @returns data
 */
const scrapeChampagneTypes = async (url) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    console.log("Navigating to champagne URL");
    await page.goto(url);

    // Take a screenshot
    await page.screenshot({ path: "drink.png", fullPage: "new" });
    console.log("Screenshot saved");

    const champagneTypes = await page.$$eval(
      ".prods-grid-container .dng-product-card",
      (data) =>
        data.map((e) => ({
          url: e.querySelector(".dng-product-card a").href,
          title: e.querySelector(".dng-product-card span").innerText,
        }))
    );

    // Save champagne types to a file
    await fs.writeFile("champagnetypes.json", JSON.stringify(champagneTypes));
    console.log("Champagne types saved successfully");
  } catch (error) {
    console.error("Error while scraping champagne types:", error);
  } finally {
    await browser.close();
  }
};

// Initialize functions
scrapePopularCategories("https://drinks.ng/");
scrapeChampagneTypes("https://drinks.ng/champagne-bavwi/");
