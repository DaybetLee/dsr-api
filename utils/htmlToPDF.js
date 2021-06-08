const puppeteer = require("puppeteer");
const hb = require("handlebars");

module.exports = async (outputFilename, emailTemplate) => {
  let data = {};

  const template = hb.compile(emailTemplate, { strict: true });

  const html = template(data);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(html);

  await page.pdf({ path: `./tmp/${outputFilename}.pdf`, format: "A4" });

  await browser.close();
};
