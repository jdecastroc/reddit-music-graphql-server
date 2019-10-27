// import * as cheerio from "cheerio";
// import * as request from 'request';
// import getPlaylistFromSubReddits from "./parser/sub-reddits-songs";
import { ApolloServer } from 'apollo-server';

import resolvers from './resolvers';
import typeDefs from './schemas';

const server = new ApolloServer({
  resolvers,
  typeDefs,
  tracing: true,
  cacheControl: true,
});

server.listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => console.log(`Server ready at ${url}. `));

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.stop());
}
