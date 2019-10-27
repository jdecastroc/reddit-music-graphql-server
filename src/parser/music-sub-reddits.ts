import * as cheerio from "cheerio";
import * as request from 'request';
import { MusicGenre } from "../resolvers";

function getSubRedditsInfo($: CheerioStatic) {
  const redditList: MusicGenre[] = [];
  $('.md.wiki').find('h2').each((i, element) => {
    redditList[i] = {
      title: '',
      subGenreUrlList: [],
    };
    redditList[i].title = $(element).text();
    redditList[i].subGenreUrlList = getSubRedditsList($, element);
  })
  return redditList;
}

function getSubRedditsList($: CheerioStatic, container: CheerioElement) {
  return $(container).next('ul').find('li').map((o, redditElement) => 
    getSubRedditsLink($, redditElement)
  ).get()
}

function getSubRedditsLink($: CheerioStatic, redditElement: CheerioElement) {
  return $(redditElement).find('a').map((k: number, anchor: CheerioElement) => 
    $(anchor).attr('href')
  ).get()
}

export default async function getMusicSubReddits(): Promise<MusicGenre[]> {
  return new Promise((resolve, reject) => {
    try {
      request('https://www.reddit.com/r/Music/wiki/musicsubreddits', (err, res, body) => {
        const $ = cheerio.load(body);
        resolve(getSubRedditsInfo($));
      });
    } catch(e) {
      reject(e);
    }
  })
}