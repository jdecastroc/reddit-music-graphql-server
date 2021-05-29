import { gql } from 'apollo-server';

export default gql`

  enum SortingType {
    hot
    new 
    top
  }

  type Reddit @cacheControl(maxAge: 604800) {
    title: String,
    subGenreUrlList: [String]
  }

  type Playlist @cacheControl(maxAge: 860) {
    name: String,
    songs: [Song]
  }

  type Song @cacheControl(maxAge: 860) {
    name: String,
    url: String,
    imageUrl: String
  }

  type Query @cacheControl(maxAge: 860) {
    """
    Get music subgenres
    """
    reddits: [Reddit],
    """
    Get playlist from subreddits
    """
    playlist(redditUrls: [String]!, sortingType: [SortingType]): [Playlist]
  }
`;