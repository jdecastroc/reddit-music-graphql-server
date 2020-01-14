import getMusicSubReddits from "./parser/music-sub-reddits";
import getPlaylistFromSubReddits from "./parser/sub-reddits-songs";

export default {
  Query: {
    reddits: async (): Promise<MusicGenre[]> => {
      return await getMusicSubReddits();
    },
    playlist: async(root, { redditUrls }): Promise<Playlist[]> => {
      return await getPlaylistFromSubReddits(redditUrls);
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
  name: string;
  url: string;
  imageUrl: string;
}