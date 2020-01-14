import * as cheerio from "cheerio";
import * as request from 'request';
import { Playlist, Song } from "../resolvers";

function getYouTubeID(url: string) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[7].length === 11) {
      return match[7];        
  }
  return null;
}

function getSubRedditSongs(subRedditName: string, sortBy: SortingOptions = 'hot'): Promise<Song[]> {
  return new Promise((resolve, reject) => {
    const url = `https://www.reddit.com/r/${subRedditName}${sortBy === 'new' ? '/new/' : ''}`;
    try {
      request(url, (err, res, body) => {
        const redditSongs: Song[] = [];
        const $ = cheerio.load(body);
        $('div').each((index, divElement) => {
          if ($(divElement).attr('data-click-id') === 'background') { 
            const song: Song = {
              name: null,
              url: null,
              imageUrl: null,
            }
            $(divElement).find('a').map((index, nestedAnchorElement) => {
              if ($(nestedAnchorElement).attr('href').includes('v=')) {
                song.url = $(nestedAnchorElement).attr('href');
              }
              if($(nestedAnchorElement).attr('href').includes(`/r/${subRedditName}/comments/`) && $(nestedAnchorElement).attr('data-click-id') === 'body') {
                $(nestedAnchorElement).find('h3').map((index, headerElement) => {
                  song.name = $(headerElement).text()
                }).get()
              }
              
            });
            if(song.url && song.name) {
              const songId = getYouTubeID(song.url);
              song.imageUrl = songId ? `https://img.youtube.com/vi/${songId}/0.jpg` : null;
              redditSongs.push(song);
            }
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
