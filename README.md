## About the project
This project has been developed for educational purposes to serve as a backend for frontend mentorship programs. It is a simple but yet interesting API that crawls reddit to obtain songs from musical reddits, easy to understand and with many possibilities for frontend apps to leverage it.

### Examples of apps using it
- https://github.com/codeminnam/musicplayer - @codeminnam

## Stack
- Apollo Server (GraphQL) + Apollo In-memory cache plugin for resolvers
- Puppeteer (DOM Crawler)
- Heroku as deployment platform

## GraphQL Playground
https://reddit-music-graphql.herokuapp.com/

## Queries
Get a list of music genres and subgenres reddits
```ts
{
  reddits {
    title
    subGenreUrlList
  }
}
```

Get a list of youtube links based on the reddits you want to search and the sorting type (check schema in GraphQL platform)
```ts
{
  playlist(redditUrls: ["kpop", "jpop"], sortingType: hot) {
    name
    songs {
      name
      url
      imageUrl
    }
  }
}
```


