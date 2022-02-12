import puppeteer, { ElementHandle } from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.90min.com/posts/2022-mls-schedule-fixtures-results', {
    waitUntil: 'networkidle2'
  });
  //convert elements to json from selector '.mls-o-match-strip__club-group'
  const json = await page.evaluate(() => {
    const elements = document.querySelectorAll('main');
    const json = Array.from(elements).map(element => {
      try {
        return {
          // home: element.querySelector('h2')!.textContent,
          away: element.querySelector('em')!.textContent,
          date: element.querySelector('p')!.textContent
        }
      } catch (error) {
        console.log(error);
      };
      return element.textContent
    });
    return json;
  });
  console.log(JSON.stringify(json));

  await browser.close();
})();
