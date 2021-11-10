import puppeteer, { ElementHandle } from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.atlutd.com/schedule/', {
    waitUntil: 'networkidle2'
  });
  //convert elements to json from selector '.mls-o-match-strip__club-group'
  const json = await page.evaluate(() => {
    const elements = document.querySelectorAll('.mls-o-match-strip__club-group');
    const json = Array.from(elements).map(element => {
      try {
        return {
          home: element.querySelector('.mls-o-match-strip__club--home')!.textContent,
          away: element.querySelector('.mls-o-match-strip__club--away')!.textContent,
          date: element.querySelector('.mls-o-match-strip__match-time')!.textContent
        }
      } catch (error) {
        console.log(error);
      };
    });
    return json;
  });
  console.log(json);

  await browser.close();
})();