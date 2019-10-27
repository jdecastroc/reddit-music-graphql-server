import * as cheerio from "cheerio";
import * as request from 'request';
import { Playlist } from "../resolvers";

function getSubRedditSongs(subRedditName: string, sortBy: SortingOptions = 'hot'): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const url = `https://www.reddit.com/r/${subRedditName}${sortBy === 'new' ? '/new/' : ''}`;
    try {
      request(url, (err, res, body) => {
        const redditSongs: string[] = [];
        const $ = cheerio.load(body);
        $('a').each((e, anchorElement) => {
          if($(anchorElement).attr('href').includes('youtu')) {
            redditSongs.push($(anchorElement).attr('href'))
          }
        })
        resolve(redditSongs);
      });
    } catch(e) {
      reject(e);
    }
  })
}

export default function getPlaylistFromSubReddits(subReddits: string[], sortBy: SortingOptions = 'hot'): Promise<Playlist[]> {
  return new Promise((resolve) => {
    const playlistPromises = subReddits.map(async (reddit: string): Promise<Playlist> => ({
      name: reddit,
      songs: await getSubRedditSongs(reddit, sortBy)
    }));
    Promise.all(playlistPromises).then((results) => resolve(results));
  });
}

type SortingOptions = 'hot' | 'new';
