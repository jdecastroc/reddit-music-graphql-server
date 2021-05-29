import getSongsFromReddits from "./parser/get-reddit-songs";
import getMusicReddits from "./parser/get-music-reddits";

export default {
  Query: {
    reddits: async (): Promise<MusicGenre[]> => {
      return await getMusicReddits();
    },
    playlist: async (root, { redditUrls }): Promise<Playlist[]> => {
      return await getSongsFromReddits(redditUrls);
    }
  }
};

export type MusicGenre = {
  title: string;
  subGenreUrlList: string[];
}

export type Playlist = {
  name: string;
  songs: Song[];
}

export type Song = {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
}