import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';

import { Crawler } from './utils';
import { resolvers } from './resolver/resolvers';
const port: number | string = process.env.PORT || 3000;

const typeDefs = importSchema(__dirname + '/schema/schema.graphql');

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  resolverValidationOptions: { requireResolversForResolveType: false }
});

const options = {
  port,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground'
};

server.start(options, ({ port }) => console.log(`Server is running on http://localhost:${port}`));

const crawlerServer: Crawler = new Crawler();
crawlerServer.init();
