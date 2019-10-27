import { gql } from 'apollo-server';

export default gql`
  type Reddit @cacheControl(maxAge: 604800) {
    title: String,
    subGenreUrlList: [String]
  }

  type Playlist {
    name: String,
    songs: [String]
  }

  type Query {
    """
    Get music subgenres
    """
    reddits: [Reddit],
    """
    Get playlist from subreddits
    """
    playlist(redditUrls: [String]!): [Playlist]
  }
`;