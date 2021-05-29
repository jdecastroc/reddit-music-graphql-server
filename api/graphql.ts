import { ApolloServer } from 'apollo-server';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import resolvers from '../src/resolvers';
import typeDefs from '../src/schemas';

const server = new ApolloServer({
  resolvers,
  typeDefs,
  tracing: true,
  cacheControl: true,
  plugins: [responseCachePlugin()],
  playground: true,
  introspection: true,
});

server.listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => console.log(`Server ready at ${url}. `));

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.stop());
}
