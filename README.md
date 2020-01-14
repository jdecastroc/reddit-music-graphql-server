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

Get a list of youtube links based on the reddits you want to search
```ts
{
  playlist(redditUrls: ["kpop", "jpop"]) {
    name
    songs {
      name
      url
      imageUrl
    }
  }
}
```


