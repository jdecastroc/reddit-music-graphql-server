import puppeteer from 'puppeteer';
import { Playlist, Song } from "../resolvers";

type SortingType = 'hot' | 'new' | 'top';

const getRedditSongs = async (subRedditName: string, sortBy: SortingType) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    const url = `https://www.reddit.com/r/${subRedditName}/${sortBy}`;
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });

    const songs = await page.evaluate(() => {
      function getYouTubeID(url: string) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[7].length === 11) {
          return match[7];
        }
        return null;
      }

      const youtubeAnchors = Array.from(document.getElementsByTagName('a')).filter((a) => a.href.includes('youtu.be') || a.href.includes('youtube'))
      return youtubeAnchors.map((songInfoContainer) => {
        const parentChildrenContainerHoldingTitle = songInfoContainer.parentElement.previousElementSibling.children[0];
        const name = parentChildrenContainerHoldingTitle ? parentChildrenContainerHoldingTitle.textContent : songInfoContainer.textContent;
        const url = songInfoContainer.href;
        const id = getYouTubeID(url);
        const imageUrl = id && `https://img.youtube.com/vi/${id}/0.jpg`;
        return { id, name, url, imageUrl } as Song;
      })
    })
    await browser.close();
    return songs;
  } catch (err) {
    console.log("error - " + err);
  }
}

const getSongsFromReddits = (redditList: string[], sortBy: SortingType = 'hot'): Promise<Playlist[]> => {
  return new Promise((resolve) => {
    const playlistPromises = redditList.map(async (reddit: string): Promise<Playlist> => ({
      name: reddit,
      songs: await getRedditSongs(reddit, sortBy)
    }));
    Promise.all(playlistPromises).then((results) => resolve(results));
  });
}

export default getSongsFromReddits;
