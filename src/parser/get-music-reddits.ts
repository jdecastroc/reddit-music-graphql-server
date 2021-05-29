import puppeteer from 'puppeteer';
import { MusicGenre } from "../resolvers";

const getMusicReddits = async () => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www.reddit.com/r/Music/wiki/musicsubreddits', {
      waitUntil: 'networkidle2',
    });
    await page.waitForSelector('.md.wiki');
    const redditList = await page.evaluate(() => {
      const redditList: MusicGenre[] = [];
      const container = document.getElementsByClassName('md wiki');
      const genres = container[0].getElementsByTagName('h2');
      return Array.from(genres).reduce((acc, element, i) => {
        acc[i] = {
          title: element.textContent,
          subGenreUrlList: Array.from(element.nextElementSibling.children).map((element, i) => {
            console.log(element)
            const anchorChildren = element.children[0];
            return anchorChildren ? anchorChildren.getAttribute('href') : '';
          })
        }
        return acc;
      }, redditList);
    });
    await browser.close();
    return redditList;
  } catch (err) {
    console.log("error - " + err);
  }
}

export default getMusicReddits;
